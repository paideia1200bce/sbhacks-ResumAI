// Import required modules
const multer = require("multer");
const pdfParse = require("pdf-parse");
const axios = require("axios");
const FormData = require("form-data");

// Configure multer
const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).single("file");

const apiKey = process.env.OPEN_API_KEY;

// Vercel serverless function handler
module.exports = (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      console.error("Multer error:", err);
      return res.status(500).send("Failed to process the file.");
    }

    // Rest of your code
    // ...
    console.log("upload endpoint accessed");
    console.log(req.file);
    const { buffer, originalname, mimetype } = req.file;

    // Check if the file is a PDF
    if (mimetype !== "application/pdf") {
      return res.status(400).send("File must be a PDF.");
    }

    try {
      // Process the PDF file using pdf-parse library

      const pdfData = await pdfParse(buffer);

      // Make an API call to the FastAPI endpoint with the file data
      const formData = new FormData();
      // formData.append(
      //   "file",
      //   new Blob([buffer], { type: mimetype }),
      //   originalname
      // );
      formData.append("file", buffer, {
        filename: originalname,
        contentType: mimetype,
      });

      const response = await axios.post(
        //"http://localhost:8000/extract_work_text",
        "https://fastbaap.herokuapp.com/extract_work_text",
        formData,
        {
          headers: {
            ...formData.getHeaders(),
          },
        }
      );

      // Get the work_text_dict from the response
      const work_text_dict = response.data;
      console.log("response from fastboi", work_text_dict);
      // Send the work_text_dict to the client
      //res.status(200).json(work_text_dict);

      function extractHeadings(text) {
        // Define an array of common phrases used as headings in a resume
        const commonHeadings = [
          "WORK EXPERIENCE",
          "EDUCATION",
          "PROJECTS",
          "SKILLS",
          "ACHIEVEMENTS",
          "CERTIFICATIONS",
        ];

        // Create a regex pattern to match the headings and their content
        const headingPattern = commonHeadings
          .map((heading) => `(${heading})`)
          .join("|");
        const contentPattern = `([\\s\\S]*?)(?:(?:\\n(?:${headingPattern})\\s*)|$)`;
        const regexPattern = new RegExp(headingPattern + contentPattern, "g");

        // Extract the content and store it in an object as key-value pairs
        const resumeData = {};
        let match;

        while ((match = regexPattern.exec(pdfData.text)) !== null) {
          const heading = match.slice(1).find((value) => value !== undefined);
          const content = match[match.length - 1];

          if (heading && content) {
            resumeData[heading] = content.trim();
          }
        }

        console.log(resumeData);
        return resumeData;
      }

      const headings = extractHeadings(pdfData.text);
      console.log("Headings:\n", headings);
      //const workExperienceContent = headings["WORKEXPERIENCE"];
      // const workExperienceRegex =
      //   /(?:WORK EXPERIENCE\s*)([\s\S]*?)(?:(?:\nEDUCATION\s*)|(?:\nPROJECTS\s*))/;
      // const workExperienceContent = workExperienceRegex.exec(pdfData.text)[1];

      //this would contain the key, value pair for the sections
      const workExperienceContent = pdfData.text;
      //const workExperienceContent = preprocessText(headings["WORKEXPERIENCE"]);
      // console.log(
      //   "Work experience content for api req:\n",
      //   workExperienceContent
      // );

      //const workExperienceJson = JSON.stringify(workExperienceContent);

      // Make an API call to OpenAI's GPT API with the work experience content

      //const openai_api_key = "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";

      //const openai_api_url = ("https://api.openai.com/v1/engines/text-davinci-002/completions");
      //const prompt = `Summarize the following work experience:\n\n${workExperienceContent}\n\nSummary: `;

      //refactor to loop through the
      async function enhanceSectionContent(sectionName, sectionContent) {
        try {
          const response = await axios.post(
            "https://api.openai.com/v1/engines/text-davinci-002/completions",
            JSON.stringify({
              //prompt: `Given the user's input: "${userPrompt}", create a detailed description including the words photorealistic and high-quality for the interior design of a living space in a true-to-life manner.`,
              //prompt: `You are a world-class resume coach and an expert in improving resumes. Given the user's resume content: "${workExperienceContent}", enhance and improve the content by rephrasing sentences, using more professional language, and improving the overall structure. Ensure that the improved version meets high professional standards, and focus on making valuable improvements to the textual content.`,
              //prompt: `You are a world-class resume coach and an expert in improving resumes. Given the user's resume content for the "${sectionName}" section: "${sectionContent}", enhance and improve the content by rephrasing sentences, using more professional language, and improving the overall structure. Ensure that the improved version meets high professional standards, and focus on making valuable improvements to the textual content.`,
              prompt: `revamp the content for the "${sectionName}" section provided by the user: "${sectionContent}". Elevate the content by rewording sentences, incorporating professional language, and optimizing the overall structure. Emphasize creating significant enhancements to the textual content, ensuring it adheres to the highest professional standards.`,
              //The description should capture the essence of the theme, include essential elements, and describe the atmosphere, furniture, decorations, color scheme, and other aspects of the room in a true-to-life manner.`,
              max_tokens: 1024, // Increase max tokens if necessary
              n: 1, // Generate multiple responses
              stop: null, // Stop when encountering a newline character
              temperature: 0.8, // Adjust the temperature for more diverse outputs
              //top_p: 0.7, // Use top_p instead of temperature for more focused outputs
              echo: false, // Do not include the input prompt in the response
            }),
            {
              headers: {
                "Content-Type": "application/json; charset=utf-8",
                Authorization: `Bearer ${openapiKey}`,
              },
            }
          );
          // return response.data.choices[0].text.trim();
          const generatedText = response.data.choices[0].text.trim();
          console.log("generated improved resume:", generatedText);

          //return res(generatedText);
          //res.status(200).contentType("text/plain").send(generatedText);
          // res.status(200).json({
          //   work_text_dict: work_text_dict,
          //   //generatedText: generatedText,
          // });

          return response.data.choices[0].text.trim();
        } catch (error) {
          console.error("Error generating detailed prompt:", error);
          //throw error;
          return sectionContent;
        }
      }

      async function enhanceResumeSections() {
        for (const sectionKey in work_text_dict) {
          if (work_text_dict.hasOwnProperty(sectionKey)) {
            const originalContent = work_text_dict[sectionKey];
            console.log("original content:", originalContent);
            const enhancedContent = await enhanceSectionContent(
              sectionKey,
              originalContent
            );
            console.log("enhanced content:", enhancedContent);
            work_text_dict[sectionKey] = enhancedContent;
          }
        }
      }

      enhanceResumeSections().then(() => {
        console.log("Enhanced resume sections:", work_text_dict);
        res.status(200).json({
          work_text_dict,
          //generatedText: generatedText,
        });
      });

      return "pdf handler accessed";
    } catch (error) {
      console.error("Error processing PDF file:", error);
      res.status(500);
      // .send("Failed to process PDF file.");
      return "failed to process pdf file";
    }

    // Process the PDF file (e.g., extract text, analyze content, etc.)
    // This part depends on the specific PDF processing library you choose.
    // See the following example for a simple way to read the PDF content
    // TODO: Process the PDF content using a PDF processing library

    // Send a response
    //res.send("PDF file processed successfully");
    return "pdf handler accessed";
  });
};
