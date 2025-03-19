import { View } from '@tarojs/components'
import { Form, Popup, Radio, Input, Button, TextArea } from '@nutui/nutui-react-taro'
import { TaskStatus } from '@/request/taskApi'

interface FollowPopupProps {
  visible: boolean
  onClose: () => void
  onSubmit: (values: { status: string; remark: string }) => void
}

const statusOptions = [
  { label: '已回厂', value: TaskStatus.Returned },
  { label: '战败', value: TaskStatus.Rejected },
]

function FollowPopup({ visible, onClose, onSubmit }: FollowPopupProps) {
  const [form] = Form.useForm()

  const handleSubmit = (values) => {
    onSubmit(values)
    form.resetFields()
  }

  return (
    <Popup
      visible={visible}
      position='bottom'
      onClose={onClose}
      style={{ height: '60vh' }}
    >
      <View className='follow-popup'>
        <View className='popup-header'>
          <View className='title'>跟进工单</View>
        </View>
        <Form form={form} onFinish={handleSubmit}>
          <Form.Item
            label='跟进状态'
            name='status'
            rules={[{ required: true, message: '请选择跟进状态' }]}
          >
            <Radio.Group>
              {statusOptions.map(option => (
                <Radio key={option.value} value={option.value}>
                  {option.label}
                </Radio>
              ))}
            </Radio.Group>
          </Form.Item>

          <Form.Item
            label='备注信息'
            name='remark'
          >
            <TextArea placeholder='请输入备注信息' maxLength={8} />
          </Form.Item>

          <View className='popup-footer'>
            <Button onClick={onClose}>取消</Button>
            <Button color="#4e54c8" formType='submit'>确定</Button>
          </View>
        </Form>
      </View>
    </Popup>
  )
}

export default FollowPopup