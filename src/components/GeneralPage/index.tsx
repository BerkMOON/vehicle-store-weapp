import CustomTabBar from "../CustomTabBar"

const GeneralPage = (props) => {
  return <>
    {props.children}
    <CustomTabBar/>
  </>
}

export default GeneralPage