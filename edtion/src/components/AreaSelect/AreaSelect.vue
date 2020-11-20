<!--
 * @Author: ChenXingLiang
 * @Date: 2019-08-12 15:09:38
 * @LastEditors: ChenXingLiang
 * @LastEditTime: 2019-08-13 11:44:23
 * @Description:
 -->
<template>
  <div>
    省： <a-select
      style="width: 120px"
      @change="handleProvinceChange"
      placeholder="选择省级"
    >
      <a-select-option
        v-for="province in provinces"
        :key="province.value"
      >{{ province.label }}</a-select-option>
    </a-select>
    市： <a-select
      v-model="curCity"
      style="width: 120px"
      @change="handleCityChange"
      placeholder="选择市级"
    >
      <a-select-option
        v-for="city in cities"
        :key="city.value"
      >{{ city.label }}</a-select-option>
    </a-select>
    区：<a-select
      v-model="curDistrict"
      style="width: 120px"
      @change="handleDistrictChange"
      placeholder="选择市级"
    >
      <a-select-option
        v-for="district in districts"
        :key="district.value"
      >{{ district.label }}</a-select-option>
    </a-select>
  </div>
</template>

<script>
import address from '@/config/address'

export default {
  name: 'AreaSelect',
  props: {
    selectCode: {
      type: String,
      default: '',
      required: false
    }
  },
  model: {
    prop: 'selectCode',
    event: 'select'
  },
  data () {
    return {
      provinces: address,
      cities: [],
      districts: [],
      curCode: '',
      curProvince: [],
      curDistrict: '',
      curCity: ''
    }
  },
  methods: {
    handleProvinceChange (value) {
      const province = this.provinces.filter(item => { return item.value === value })
      if (province.length > 0) {
        this.curCoe = province[0].value
        this.cities = province[0].children
        this.districts = []
        this.curCity = ''
        this.curDistrict = ''
        console.log('提交省：', province[0].value)
        this.$emit('select', province[0].value)
        this.handleCityChange(this.curCity)
        this.handleDistrictChange(this.curDistrict)
      }
    },
    handleCityChange (value) {
      const city = this.cities.filter(item => { return item.value === value })
      if (city.length > 0) {
        this.curCoe = city[0].value
        this.districts = city[0].children
        this.curDistrict = ''
        console.log('提交市：', city[0].value)
        this.$emit('select', city[0].value)
        this.handleDistrictChange(this.curDistrict)
      }
    },
    handleDistrictChange (value) {
      console.log('市：', value)
      if (value) {
        this.curCoe = value
        this.$emit('select', this.curCoe)
      }
    },
    created () {
    },
    getSelect () {
      return this.curCode
    }
  }
}
</script>
