import { View } from '@tarojs/components'
import { Button, Form } from '@nutui/nutui-react-taro'
import { useRef, useState } from 'react'
import { UserAPI } from '@/request/userApi'
import { UserListInfo, GetAllBusinessUsersRequest } from '@/request/userApi/typings'
import GeneralPage from '@/components/GeneralPage'
import ScrollableList from '@/components/ScrollableList'
import { ROLES_INFO } from '@/common/constants/constants'
import FilterPopup from './components/FilterPopup'
import './index.scss'

function UserList() {
  const [form] = Form.useForm()
  const listRef = useRef<{ refresh: () => void }>()
  const [showFilter, setShowFilter] = useState(false)
//   const [showEditInfo, setShowEditInfo] = useState(false)
//   const [showEditRole, setShowEditRole] = useState(false)
//   const [showCreate, setShowCreate] = useState(false)
//   const [currentUser, setCurrentUser] = useState<UserListInfo | null>(null)

  const fetchData = async (page: number) => {
    const formValues = form.getFieldsValue(true) as GetAllBusinessUsersRequest
    const params: GetAllBusinessUsersRequest = {
      page,
      limit: 10,
      ...formValues,
    }
    const res = await UserAPI.getUserRoles(params)
    return res?.data?.role_list || []
  }

//   const handleStatusChange = async (user: UserListInfo) => {
//     Dialog.open('disable', {
//       title: '提示',
//       content: `确定要${user.status?.code === 1 ? '禁用' : '启用'}该用户吗？`,
//       onConfirm: async () => {
//         try {
//           await UserAPI.status({
//             user_id: user.id!,
//             status: user.status?.code === 1 ? 'deleted' : 'active'
//           })
//           Dialog.close('disable')
//           Taro.showToast({ title: '操作成功', icon: 'success' })
//           listRef.current?.refresh()
//         } catch (error) {
//           Dialog.close('disable')
//           Taro.showToast({ title: '操作失败', icon: 'error' })
//         }
//       },
//       onCancel: () => {
//         Dialog.close('disable')
//       },
//     })
//   }

//   const handleEditUser = (user: UserListInfo) => {
//     setCurrentUser(user)
//     setShowEditInfo(true)
//   }

//   const handleEditRole = (user: UserListInfo) => {
//     setCurrentUser(user)
//     setShowEditRole(true)
//   }

  const renderItem = (user: UserListInfo) => (
    <View className='user-item' key={user.id}>
      <View className='user-info'>
        <View className='info-row'>
          <View className='label'>用户账号：</View>
          <View className='value'>{user.username}</View>
        </View>
        <View className='info-row'>
          <View className='label'>用户名称：</View>
          <View className='value'>{user.nickname}</View>
        </View>
        <View className='info-row'>
          <View className='label'>手机号：</View>
          <View className='value'>{user.phone || '-'}</View>
        </View>
        <View className='info-row'>
          <View className='label'>邮箱：</View>
          <View className='value'>{user.email || '-'}</View>
        </View>
        <View className='info-row'>
          <View className='label'>角色：</View>
          <View className='value'>{ROLES_INFO[user.role]}</View>
        </View>
        <View className='info-row'>
          <View className='label'>状态：</View>
          <View className='value'>{user.status?.name}</View>
        </View>
      </View>
      {/* <View className='user-actions'>
        <Button size='small' onClick={() => handleEditUser(user)}>编辑信息</Button>
        <Button size='small' onClick={() => handleEditRole(user)}>修改角色</Button>
        <Button
          size='small'
          type={user.status?.code === 1 ? 'danger' : 'info'}
          onClick={() => handleStatusChange(user)}
        >
          {user.status?.code === 1 ? '禁用' : '启用'}
        </Button>
      </View> */}
    </View>
  )

  return (
    <GeneralPage>
      <View className='user-list-container'>
        <View className='header'>
          <Button className='filter-btn' onClick={() => setShowFilter(true)}>筛选</Button>
          {/* <Button
            color='#4e54c8'
            onClick={() => setShowCreate(true)}
          >
            新建员工
          </Button> */}
        </View>

        <ScrollableList
          ref={listRef}
          fetchData={fetchData}
          renderItem={renderItem}
          emptyText='暂无用户数据'
        />

        <FilterPopup
          visible={showFilter}
          onClose={() => setShowFilter(false)}
          onSearch={() => {
            setShowFilter(false)
            listRef.current?.refresh()
          }}
          onReset={() => form.resetFields()}
          form={form}
        />

        {/* <CreateUserPopup
          visible={showCreate}
          onClose={() => setShowCreate(false)}
          onSuccess={() => listRef.current?.refresh()}
        />

        <EditInfoPopup
          visible={showEditInfo}
          onClose={() => setShowEditInfo(false)}
          onSuccess={() => listRef.current?.refresh()}
          currentUser={currentUser}
        />

        <EditRolePopup
          visible={showEditRole}
          onClose={() => setShowEditRole(false)}
          onSuccess={() => listRef.current?.refresh()}
          currentUser={currentUser}
        /> */}

        {/* <Dialog id="disable" /> */}
      </View>
    </GeneralPage>
  )
}

export default UserList