from fastapi import FastAPI, File, UploadFile
import fitz #pymupdf
from typing import Dict
import re
import pandas as pd
from unidecode import unidecode
import numpy as np
import io

app = FastAPI()


def pdf_to_span_df(resume_pdf):
    #doc = fitz.open(resume_pdf)
    doc = fitz.open("pdf", resume_pdf.read())

    block_dict = {}
    page_num = 1

    for page in doc:
        file_dict = page.get_text('dict')
        block = file_dict['blocks']
        block_dict[page_num] = block
        page_num += 1
    
    doc.close()

    spans = pd.DataFrame(columns = ['xmin', 'ymin', 
                                    'xmax', 'ymax', 
                                    'text', 'tag'])

    rows = []

    for page_num, blocks in block_dict.items():

        for block in blocks:

            if block['type'] == 0:
                for line in block['lines']:
                    for span in line['spans']:
                        xmin, ymin, xmax, ymax = list(span['bbox'])
                        font_size = span['size']
                        text = unidecode(span['text'])
                        span_font = span['font']

                        is_upper = False
                        is_bold = False

                        if 'bold' in span_font.lower():
                            is_bold = True

                        if re.sub("[\(\[].*?[\)\]]", "", text).isupper():
                            is_upper = True

                        if text.replace(' ', '') != '':
                            rows.append((xmin, ymin, xmax, ymax, text, 
                                     is_upper, is_bold, span_font, font_size))
    
    span_df = pd.DataFrame(rows, columns= ['xmin', 'ymin', 'xmax', 'ymax', 
                                       'text', 'is_upper', 'is_bold', 
                                       'span_font', 'font_size'])

    return span_df
    


def get_heading_info(span_df):
    keywords = ['job history', 'employment', 'work history', 
                'experience', 'involvement']
    
    body_size = span_df['font_size'].value_counts().idxmax()
    body_font = span_df['span_font'].value_counts().idxmax()

    heading = span_df[ ((span_df['font_size'] > body_size) | (span_df['span_font'] != body_font)) & (span_df['text'].str.lower().str.contains('|'.join(keywords))) ]
    
    heading_indices = heading.index.tolist()
    heading_font = heading['span_font'].iloc[0]
    heading_size = heading['font_size'].iloc[0]

    #return heading_indices, heading_font, heading_size
    return heading_font, heading_size, #heading_indices



def get_work_text(span_df):
    #heading_indices, heading_font, heading_size = get_heading_info(span_df)
    heading_font, heading_size = get_heading_info(span_df)
    title_df = span_df[(span_df['span_font'] == heading_font) & (span_df['font_size'] == heading_size)]
    heading_indices = title_df.index.tolist()
    work_text_dict = {}

    for index in heading_indices:
        heading_title = span_df.iloc[index].text.rstrip()
        #next_heading = span_df[(span_df['span_font'] == heading_font) & (span_df['font_size'] == heading_size)].loc[index + 1:]
        next_heading = title_df.loc[index + 1:]

        if not next_heading.empty:
            next_heading_index = next_heading.index[0]
            work_text_df = span_df.loc[index + 1: next_heading_index - 1]
            work_text = work_text_df['text'].str.cat(sep = ' ')
            work_text_dict[heading_title] = work_text
            continue
        
        work_text_df = span_df.loc[index + 1:]
        work_text = work_text_df['text'].str.cat(sep = ' ') 
        work_text_dict[heading_title] = work_text
            
    
    return work_text_dict


# Use this function 
# not sure how to get it to work with the pdf file
def path_to_work_dict(filepath):
    span_df = pdf_to_span_df(filepath)
    return get_work_text(span_df)



@app.post("/extract_work_text", response_model=Dict[str, str])
async def extract_work_text(file: UploadFile = File(...)):
    # Read the uploaded file content
    file_content = await file.read()
    # Create a BytesIO object from the file content
    pdf_file = io.BytesIO(file_content)
    
    # Call your existing path_to_work_dict() function with the BytesIO object
    work_text_dict = path_to_work_dict(pdf_file)

    return work_text_dict



