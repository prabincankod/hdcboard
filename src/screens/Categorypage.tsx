import { useParams } from "react-router-dom";

const Categorypage = () => {
  const { slug } = useParams();
  console.log('from category page', slug);

  return <div> {slug}</div>;
};
export default Categorypage;
