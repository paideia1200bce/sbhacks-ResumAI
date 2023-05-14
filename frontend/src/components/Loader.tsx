//implement this component in the recommendations page
//to show loader if no recommendations are fetched
import ClipLoader from "react-spinners/ClipLoader";

const Loader = () => (
  <div className="full-page-loader">
    <ClipLoader size={150} color={"#3454D1"} loading={true} />
  </div>
);

export default Loader;
