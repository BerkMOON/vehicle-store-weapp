import { Loading } from "@nutui/nutui-react-taro"
import CustomTabBar from "../CustomTabBar"
import "./index.scss"

const GeneralPage = (props) => {
  const { loading } = props
  return <>
    <view className="general-page">
      {loading ? <Loading type="spinner" /> : props.children}
    </view>
    <CustomTabBar />
  </>
}

export default GeneralPage