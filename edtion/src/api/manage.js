import { axios } from '@/utils/request'

const api = {
  user: '/user',
  role: '/role',
  service: '/service',
  permission: '/permission',
  permissionNoPager: '/permission/no-pager',
  orgTree: '/org/tree'
}

export default api

/**
 * 查询机构列表
 * @param {} parameter
 */
export function findMechanismList (parameter) {
  return axios({
    url: '/mechanism/findMechanismList',
    method: 'post',
    data: parameter
  })
}
/**
 * 查询全部机构
 * @param {} parameter
 */
export function findAllMechanism () {
  return axios({
    url: '/mechanism/findAllMechanism',
    method: 'get'
  })
}
/**
 * 查询全部老师
 * @param {} parameter
 */
export function findAllTeacher () {
  return axios({
    url: '/teacher/findAllTeacher',
    method: 'get'
  })
}
/**
 * 查询没有认证的老师
 * @param {} parameter
 */
export function findAllAuthTeacher () {
  return axios({
    url: '/teacher/findAllAuthTeacher',
    method: 'get'
  })
}
/**
 * 查询全部学生
 * @param {} parameter
 */
export function findAllStudent () {
  return axios({
    url: '/student/findAllStudent',
    method: 'get'
  })
}
/**
 * 查询全部主题类型
 * @param {} parameter
 */
export function findAllThemeType () {
  return axios({
    url: '/themeType/findAllThemeType',
    method: 'get'
  })
}
/**
 * 查询教师列表
 * @param {} parameter
 */
export function findTeacherList (parameter) {
  return axios({
    url: '/teacher/findTeacherList',
    method: 'post',
    data: parameter
  })
}
/**
 * 查询学生列表
 * @param {} parameter
 */
export function findStudentList (parameter) {
  return axios({
    url: '/student/findStudentList',
    method: 'post',
    data: parameter
  })
}

/**
 * 查询礼品列表
 * @param {} parameter
 */
export function findGiftList (parameter) {
  return axios({
    url: '/gift/findGiftList',
    method: 'post',
    data: parameter
  })
}

/**
 * 查询充值套餐列表
 * @param {} parameter
 */
export function findRechargeList (parameter) {
  return axios({
    url: '/recharge/findRechargeList',
    method: 'post',
    data: parameter
  })
}

/**
 * 查询抵扣学费套餐列表
 * @param {} parameter
 */
export function findDeductionList (parameter) {
  return axios({
    url: '/deduction/findDeductionList',
    method: 'post',
    data: parameter
  })
}

/**
 * 查询礼品兑换列表
 * @param {} parameter
 */
export function findExchangeGiftList (parameter) {
  return axios({
    url: '/exchangeGift/findExchangeGiftList',
    method: 'post',
    data: parameter
  })
}

/**
 * 查询主题兑换列表
 * @param {} parameter
 */
export function findComposeThemeList (parameter) {
  return axios({
    url: '/exchangeGift/findComposeThemeList',
    method: 'post',
    data: parameter
  })
}

/**
 * 查询用户充值记录
 * @param {} parameter
 */
export function findRechargeOrderList (parameter) {
  return axios({
    url: '/recharge/findRechargeOrderList',
    method: 'post',
    data: parameter
  })
}

/**
 * 查询用户充值记录
 * @param {} parameter
 */
export function pageMechanismMakeLogVo (parameter) {
  return axios({
    url: '/mechanism/pageMechanismMakeLogVo',
    method: 'post',
    data: parameter
  })
}

/**
 * 查询教师认证列表
 * @param {} parameter
 */
export function findTeacherAuthPage (parameter) {
  return axios({
    url: '/attestation/findTeacherAuthPage',
    method: 'post',
    data: parameter
  })
}
/**
 * 查询评论列表
 * @param {} parameter
 */
export function findCommentPage (parameter) {
  return axios({
    url: '/comment/findCommentPage',
    method: 'post',
    data: parameter
  })
}
/**
 * 查询用户列表
 * @param {} parameter
 */
export function findUserPage (parameter) {
  return axios({
    url: '/user/findUserPage',
    method: 'post',
    data: parameter
  })
}
/**
 * 修改用户绑定的机构
 * @param {} parameter
 */
export function updateUserAuthMechanism (parameter) {
  return axios({
    url: '/user/updateUserAuthMechanism',
    method: 'post',
    data: parameter
  })
}

/**
 * 修改用户的积分
 * @param {} parameter
 */
export function updateUserScore (parameter) {
  return axios({
    url: '/user/updateUserScore',
    method: 'get',
    params: parameter
  })
}

/**
 * 修改用户绑定的教师
 * @param {} parameter
 */
export function updateUserAuthTeacher (parameter) {
  return axios({
    url: '/user/updateUserAuthTeacher',
    method: 'post',
    data: parameter
  })
}

/**
 * 修改机构绑定的工作人员
 * @param {} parameter
 */
export function updateMechanismPersonnel (parameter) {
  return axios({
    url: '/mechanism/updateMechanismPersonnel',
    method: 'post',
    data: parameter
  })
}
/**
 * 修改用户的等级
 * @param {} parameter
 */
export function updateUserGrade (parameter) {
  return axios({
    url: '/user/updateUserGrade',
    method: 'get',
    params: parameter
  })
}

/**
 * 查询工作人员
 * @param {} parameter
 */
export function findPersonnelUser () {
  return axios({
    url: '/user/findPersonnelUser',
    method: 'get'
  })
}

/**
 * 查询绑定了教师的用户
 * @param {} parameter
 */
export function findUserName () {
  return axios({
    url: '/user/findUserName',
    method: 'get'
  })
}
/**
 * 心情列表
 * @param {} parameter
 */
export function findUserMoodPage (parameter) {
  return axios({
    url: '/mood/findUserMoodPage',
    method: 'post',
    data: parameter
  })
}
/**
 * 机构认证申请列表
 * @param {} parameter
 */
export function findMechanismSettlementList (parameter) {
  return axios({
    url: '/mechanism/findMechanismSettlementList',
    method: 'post',
    data: parameter
  })
}
/**
 * 修改心情的显示状态
 * @param {} parameter
 */
export function updateIsDetele (parameter) {
  return axios({
    url: '/mood/updateIsDetele',
    method: 'get',
    params: parameter
  })
}

/**
 * 修改心情的绑定用户
 * @param {} parameter
 */
export function updateMoodBindUser (parameter) {
  return axios({
    url: '/mood/updateMoodBindUser',
    method: 'get',
    params: parameter
  })
}

/**
 * 修改机构认证申请状态
 * @param {} parameter
 */
export function updateMechanismSettlementFlag (parameter) {
  return axios({
    url: '/mechanism/updateMechanismSettlementFlag',
    method: 'get',
    params: parameter
  })
}
/**
 * 删除评论
 * @param {} parameter
 */
export function delComment (parameter) {
  return axios({
    url: '/comment/delComment',
    method: 'get',
    params: parameter
  })
}
/**
 * 修改用户的封禁状态
 * @param {} parameter
 */
export function updateUserFlag (parameter) {
  return axios({
    url: '/user/updateUserFlag',
    method: 'get',
    params: parameter
  })
}
/**
 * 查询机构认证列表
 * @param {} parameter
 */
export function findMechanismAuthPage (parameter) {
  return axios({
    url: '/attestation/findMechanismAuthPage',
    method: 'post',
    data: parameter
  })
}
/**
 * 教师认证通过
 * @param {} parameter
 */
export function teacherCertificationPassed (parameter) {
  return axios({
    url: '/attestation/teacherCertificationPassed',
    method: 'get',
    params: parameter
  })
}
/**
 * 机构认证通过
 * @param {} parameter
 */
export function mechanismCertificationPassed (parameter) {
  return axios({
    url: '/attestation/mechanismCertificationPassed',
    method: 'get',
    params: parameter
  })
}
/**
 * 教师手动认证通过
 * @param {} parameter
 */
export function headCertificationPassed (parameter) {
  return axios({
    url: '/attestation/headCertificationPassed',
    method: 'get',
    params: parameter
  })
}
/**
 * 机构手动认证通过
 * @param {} parameter
 */
export function headMechanismCertificationPassed (parameter) {
  return axios({
    url: '/attestation/headMechanismCertificationPassed',
    method: 'get',
    params: parameter
  })
}
/**
 * 查询主题列表
 * @param {} parameter
 */
export function findThemeList (parameter) {
  return axios({
    url: '/theme/findThemeList',
    method: 'post',
    data: parameter
  })
}
/**
 * 查询机构类型列表
 * @param {} parameter
 */
export function findMechanismTypeList (parameter) {
  return axios({
    url: '/mechanismType/findMechanismTypeList',
    method: 'post',
    data: parameter
  })
}
/**
 * 查询主题类型列表
 * @param {} parameter
 */
export function findThemeTypeList (parameter) {
  return axios({
    url: '/themeType/findThemeTypeList',
    method: 'post',
    data: parameter
  })
}
/**
 * 添加机构
 * @param {*} parameter
 */
export function addMechanism (parameter) {
  return axios({
    url: '/mechanism/addMechanism',
    method: 'post',
    data: parameter
  })
}
/**
 * 添加教师
 * @param {*} parameter
 */
export function addTeacher (parameter) {
  return axios({
    url: '/teacher/addTeacher',
    method: 'post',
    data: parameter
  })
}
/**
 * 添加学生
 * @param {*} parameter
 */
export function addStudent (parameter) {
  return axios({
    url: '/student/addStudent',
    method: 'post',
    data: parameter
  })
}

/**
 * 添加礼品
 * @param {*} parameter
 */
export function addGift (parameter) {
  return axios({
    url: '/gift/addGift',
    method: 'post',
    data: parameter
  })
}

/**
 * 添加充值套餐
 * @param {*} parameter
 */
export function addRecharge (parameter) {
  return axios({
    url: '/recharge/addRecharge',
    method: 'post',
    data: parameter
  })
}

/**
 * 添加学费抵扣套餐
 * @param {*} parameter
 */
export function addDeduction (parameter) {
  return axios({
    url: '/deduction/addDeduction',
    method: 'post',
    data: parameter
  })
}

/**
 * 查询积分配置
 * @param {*} parameter
 */
export function findSettingConfig () {
  return axios({
    url: '/setting/findSettingConfig',
    method: 'get'
  })
}

/**
 * 修改积分配置
 * @param {*} parameter
 */
export function updateSettingConfig (parameter) {
  return axios({
    url: '/setting/updateSettingConfig',
    method: 'post',
    data: parameter
  })
}

/**
 * 添加主题
 * @param {*} parameter
 */
export function addTheme (parameter) {
  return axios({
    url: '/theme/addTheme',
    method: 'post',
    data: parameter
  })
}

/**
 * 查询全部机构类型
 * @param {*} parameter
 */
export function findAllMechanismType () {
  return axios({
    url: '/mechanismType/findAllMechanismType',
    method: 'get'
  })
}
/**
 * 添加机构类型
 * @param {*} parameter
 */
export function addMechanismType (parameter) {
  return axios({
    url: '/mechanismType/addMechanismType',
    method: 'post',
    data: parameter
  })
}
/**
 * 添加主题类型
 * @param {*} parameter
 */
export function addThemeType (parameter) {
  return axios({
    url: '/themeType/addThemeType',
    method: 'post',
    data: parameter
  })
}
/**
 * 编辑机构类型
 * @param {*} parameter
 */
export function updateMechanismType (parameter) {
  return axios({
    url: '/mechanismType/updateMechanismType',
    method: 'post',
    data: parameter
  })
}
/**
 * 编辑主题类型
 * @param {*} parameter
 */
export function updateThemeType (parameter) {
  return axios({
    url: '/themeType/updateThemeType',
    method: 'post',
    data: parameter
  })
}
/**
 * 编辑机构
 * @param {*} parameter
 */
export function updateMechanism (parameter) {
  return axios({
    url: '/mechanism/updateMechanism',
    method: 'post',
    data: parameter
  })
}
/**
 * 编辑教师
 * @param {*} parameter
 */
export function updateTeacher (parameter) {
  return axios({
    url: '/teacher/updateTeacher',
    method: 'post',
    data: parameter
  })
}
/**
 * 编辑学生
 * @param {*} parameter
 */
export function updateStudent (parameter) {
  return axios({
    url: '/student/updateStudent',
    method: 'post',
    data: parameter
  })
}
/**
 * 编辑学生
 * @param {*} parameter
 */
export function updateGift (parameter) {
  return axios({
    url: '/gift/updateGift',
    method: 'post',
    data: parameter
  })
}

/**
 * 编辑充值套餐
 * @param {*} parameter
 */
export function updateRecharge (parameter) {
  return axios({
    url: '/recharge/updateRecharge',
    method: 'post',
    data: parameter
  })
}
/**
 * 编辑抵扣学费的套餐
 * @param {*} parameter
 */
export function updateDeduction (parameter) {
  return axios({
    url: '/deduction/updateDeduction',
    method: 'post',
    data: parameter
  })
}
/**
 * 编辑主题
 * @param {*} parameter
 */
export function updateTheme (parameter) {
  return axios({
    url: '/theme/updateTheme',
    method: 'post',
    data: parameter
  })
}
/**
 * 编辑机构审核状态
 * @param {*} parameter
 */
export function updateMechanismStatus (parameter) {
  return axios({
    url: '/mechanism/updateMechanismStatus',
    method: 'post',
    data: parameter
  })
}
/**
 * 编辑机构封禁状态
 * @param {*} parameter
 */
export function updateMechanismFlag (parameter) {
  return axios({
    url: '/mechanism/updateMechanismFlag',
    method: 'post',
    data: parameter
  })
}
/**
 * 查询单个机构
 * @param {*} parameter
 */
export function findSingleMechanism (parameter) {
  return axios({
    url: '/mechanism/findSingleMechanism',
    method: 'get',
    params: parameter
  })
}
/**
 * 查询单个教师
 * @param {*} parameter
 */
export function findSingleTeacher (parameter) {
  return axios({
    url: '/teacher/findSingleTeacher',
    method: 'get',
    params: parameter
  })
}
/**
 * 查询单个学生
 * @param {*} parameter
 */
export function findSingleStudent (parameter) {
  return axios({
    url: '/student/findSingleStudent',
    method: 'get',
    params: parameter
  })
}
/**
 * 查询单个礼品
 * @param {*} parameter
 */
export function findSingleGift (parameter) {
  return axios({
    url: '/gift/findSingleGift',
    method: 'get',
    params: parameter
  })
}

/**
 * 查询单个礼品
 * @param {*} parameter
 */
export function findSingleRecharge (parameter) {
  return axios({
    url: '/recharge/findSingleRecharge',
    method: 'get',
    params: parameter
  })
}

/**
 * 查询单个抵扣学费的套餐
 * @param {*} parameter
 */
export function findSingleDeduction (parameter) {
  return axios({
    url: '/deduction/findSingleDeduction',
    method: 'get',
    params: parameter
  })
}
/**
 * 查询单个主题
 * @param {*} parameter
 */
export function findSingleTheme (parameter) {
  return axios({
    url: '/theme/findSingleTheme',
    method: 'get',
    params: parameter
  })
}
/**
 * 查询单个机构类型
 * @param {*} parameter
 */
export function findSingleMechanismType (parameter) {
  return axios({
    url: '/mechanismType/findSingleMechanismType',
    method: 'get',
    params: parameter
  })
}
/**
 * 查询单个主题类型
 * @param {*} parameter
 */
export function findSingleThemeType (parameter) {
  return axios({
    url: '/themeType/findSingleThemeType',
    method: 'get',
    params: parameter
  })
}
/**
 * 删除单个机构
 * @param {*} parameter
 */
export function deleteMechanism (parameter) {
  return axios({
    url: '/mechanism/deleteMechanism',
    method: 'get',
    params: parameter
  })
}
/**
 * 删除单个教师
 * @param {*} parameter
 */
export function deleteTeacher (parameter) {
  return axios({
    url: '/teacher/deleteTeacher',
    method: 'get',
    params: parameter
  })
}
/**
 * 删除单个学生
 * @param {*} parameter
 */
export function deleteStudent (parameter) {
  return axios({
    url: '/student/deleteStudent',
    method: 'get',
    params: parameter
  })
}
/**
 * 删除单个礼品
 * @param {*} parameter
 */
export function deleteGift (parameter) {
  return axios({
    url: '/gift/deleteGift',
    method: 'get',
    params: parameter
  })
}

/**
 * 停用单个充值套餐
 * @param {*} parameter
 */
export function updateRechargeStatus (parameter) {
  return axios({
    url: '/recharge/updateRechargeStatus',
    method: 'get',
    params: parameter
  })
}

/**
 * 修改兑换记录的状态
 * @param {*} parameter
 */
export function updateExchangeGiftStatus (parameter) {
  return axios({
    url: '/exchangeGift/updateExchangeGiftStatus',
    method: 'get',
    params: parameter
  })
}
/**
 * 修改主题兑换记录的状态
 * @param {*} parameter
 */
export function updateComposeThemeStatus (parameter) {
  return axios({
    url: '/exchangeGift/updateComposeThemeStatus',
    method: 'get',
    params: parameter
  })
}
/**
 * 删除单个主题
 * @param {*} parameter
 */
export function deleteTheme (parameter) {
  return axios({
    url: '/theme/deleteTheme',
    method: 'get',
    params: parameter
  })
}
/**
 * 删除单个机构类型
 * @param {*} parameter
 */
export function deleteMechanismType (parameter) {
  return axios({
    url: '/mechanismType/deleteMechanismType',
    method: 'get',
    params: parameter
  })
}
/**
 * 删除单个主题类型
 * @param {*} parameter
 */
export function deleteThemeType (parameter) {
  return axios({
    url: '/themeType/deleteThemeType',
    method: 'get',
    params: parameter
  })
}

export function getUserList (parameter) {
  return axios({
    url: api.user,
    method: 'get',
    params: parameter
  })
}

export function getRoleList (parameter) {
  return axios({
    url: api.role,
    method: 'get',
    params: parameter
  })
}

export function getServiceList (parameter) {
  return axios({
    url: api.service,
    method: 'get',
    params: parameter
  })
}

export function getPermissions (parameter) {
  return axios({
    url: api.permissionNoPager,
    method: 'get',
    params: parameter
  })
}

export function getOrgTree (parameter) {
  return axios({
    url: api.orgTree,
    method: 'get',
    params: parameter
  })
}

// id == 0 add     post
// id != 0 update  put
export function saveService (parameter) {
  return axios({
    url: api.service,
    method: parameter.id === 0 ? 'post' : 'put',
    data: parameter
  })
}
