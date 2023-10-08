import React, { useEffect, useState, FormEvent } from "react"
import styles from "./Form.module.css"
import FilterMultiSelect from "../../features/forecast/FilterMultiSelect"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import { BASE_URL } from "../../utils/consts"
import axios from "axios"
import {
  ShopsData,
  caterogiesResponse,
  selectedValues,
} from "../../types/types"
import {
  changeCategories,
  changeGroups,
  changeShops,
  changeSkus,
  changeSubcategories,
  selectedCategories,
  selectedGroups,
  selectedShops,
  selectedSkus,
  selectedSubcategories,
} from "../../features/filters/fitltersSlice"

import useDate from "../../hooks/useDate"
import { data } from "../../utils/data"
import { fakeOptions, fakeShops } from "../../utils/data2"
import ForecastBtn from "../../components/forecastBtn/ForecastBtn"
import ResetBtn from "../../components/resetBtn/ResetBtn"
import { selectAllForecasts } from "../../features/forecast/forecastSlice"

type FormProps = {
  handleSubmit: (e: FormEvent) => void
}

function Form({ handleSubmit }: FormProps) {
  const dispatch = useAppDispatch()

  const [allOptions, setAllOptions] = useState<caterogiesResponse[]>([])
  const [filteredOptions, setFilteredOptions] = useState<caterogiesResponse[]>(
    [],
  )
  //select values
  const [shopOptions, setShopOptions] = useState<string[]>([])
  const [groupOptions, setGroupOptions] = useState<string[]>([])
  const [categoryOptions, setCategoryOptions] = useState<string[]>([])
  const [subcategoryOptions, setSubcategoryOptions] = useState<string[]>([])
  const [skuOptions, setSkuOptions] = useState<string[]>([])
  const [localSkus, setLocalSkus] = useState<string[]>([])
  //active filters

  //TODO: пределать локальные selectedValues, диспатчить их значения в useeffect или также
  const shops = useAppSelector(selectedShops)
  const groups = useAppSelector(selectedGroups)
  const categories = useAppSelector(selectedCategories)
  const subcategories = useAppSelector(selectedSubcategories)

  useEffect(() => {
    Promise.all([
      axios.get(`${BASE_URL}/api/v1/categories/`),
      axios.get(`${BASE_URL}/api/v1/shops/`),
    ]).then(([categoriesData, shopsData]) => {
      setAllOptions(categoriesData.data.data)
      setShopOptions(() =>
        shopsData.data.data.map((shop: ShopsData) => shop.store),
      )
    })
    // setAllOptions(fakeOptions)
    // setShopOptions(fakeShops)
  }, [])

  useEffect(() => {
    if (
      shops.length === 0 &&
      groups.length === 0 &&
      categories.length === 0 &&
      subcategories.length === 0
    ) {
      setFilteredOptions(allOptions)
    }
  }, [shops, groups, categories, subcategories, allOptions])

  useEffect(() => {
    let filteredArr: caterogiesResponse[] = []
    if (groups.length !== 0) {
      console.log("group")
      filteredArr = allOptions.filter((opt) => groups.includes(opt.group))
      setFilteredOptions(filteredArr)
      setCategoryOptions([])
      setSkuOptions([])
    }
  }, [allOptions, groups])

  useEffect(() => {
    let filteredArr: caterogiesResponse[] = []
    if (categories.length !== 0) {
      console.log("cat")
      filteredArr = allOptions.filter((opt) =>
        categories.includes(opt.category),
      )
      setFilteredOptions(filteredArr)
      setSubcategoryOptions([])
      setSkuOptions([])
    }
    if (categories.length === 0 && groups.length !== 0) {
      console.log("group&cat")
      filteredArr = allOptions.filter((opt) => groups.includes(opt.group))
      setFilteredOptions(filteredArr)
      setCategoryOptions([])
      setSkuOptions([])
    }
  }, [allOptions, categories, groups])

  useEffect(() => {
    let filteredArr: caterogiesResponse[] = []
    if (subcategories.length !== 0) {
      filteredArr = allOptions.filter((opt) =>
        subcategories.includes(opt.subcategory),
      )
      setFilteredOptions(filteredArr)
      setSkuOptions([])
    }
  }, [allOptions, subcategories])

  // Запись уникльных категорий
  useEffect(() => {
    filteredOptions.forEach((item: caterogiesResponse) => {
      setCategoryOptions((prev) =>
        prev.includes(item.category) ? prev : [...prev, item.category],
      )
      setSubcategoryOptions((prev) =>
        prev.includes(item.subcategory) ? prev : [...prev, item.subcategory],
      )
      setGroupOptions((prev) =>
        prev.includes(item.group) ? prev : [...prev, item.group],
      )
      setSkuOptions((prev) =>
        prev.includes(item.sku) ? prev : [...prev, item.sku],
      )
    })
  }, [filteredOptions])

  return (
    <form action="" onSubmit={handleSubmit} className={styles.form}>
      <fieldset className={styles.fieldset}>
        <FilterMultiSelect
          placeholder={"ТК"}
          options={shopOptions}
          values={shops}
          onChange={(values: selectedValues[]) => {
            if (values.length > 0 && values[values.length - 1].value === "*") {
              const allValues = shopOptions.map((option) => ({
                value: option,
                label: option,
              }))
              dispatch(changeShops(allValues))
              dispatch(changeSkus(skuOptions))
            } else {
              dispatch(changeShops(values))
              dispatch(changeSkus(skuOptions))
            }
          }}
        />
        <FilterMultiSelect
          placeholder={"Группа"}
          values={groups}
          options={groupOptions}
          onChange={(values: selectedValues[]) => {
            if (values.length > 0 && values[values.length - 1].value === "*") {
              const allValues = groupOptions.map((option) => ({
                value: option,
                label: option,
              }))
              dispatch(changeGroups(allValues))
              dispatch(changeSkus(skuOptions))
            } else {
              dispatch(changeGroups(values))
              dispatch(changeSkus(skuOptions))
            }
          }}
        />
        <FilterMultiSelect
          placeholder={"Категория"}
          options={categoryOptions}
          values={categories}
          onChange={(values: selectedValues[]) => {
            if (values.length > 0 && values[values.length - 1].value === "*") {
              const allValues = categoryOptions.map((option) => ({
                value: option,
                label: option,
              }))
              dispatch(changeCategories(allValues))
              dispatch(changeSkus(skuOptions))
            } else {
              dispatch(changeCategories(values))
              dispatch(changeSkus(skuOptions))
            }
          }}
        />
        <FilterMultiSelect
          placeholder={"Подкатегория"}
          options={subcategoryOptions}
          values={subcategories}
          onChange={(values: selectedValues[]) => {
            if (values.length > 0 && values[values.length - 1].value === "*") {
              const allValues = subcategoryOptions.map((option) => ({
                value: option,
                label: option,
              }))
              dispatch(changeSubcategories(allValues))
              dispatch(changeSkus(skuOptions))
            } else {
              dispatch(changeSubcategories(values))
              dispatch(changeSkus(skuOptions))
            }
          }}
        />
        <FilterMultiSelect
          placeholder={"Товар"}
          options={skuOptions}
          values={localSkus}
          onChange={(values: selectedValues[]) => {
            if (values.length > 0 && values[values.length - 1].value === "*") {
              setLocalSkus(skuOptions)
              dispatch(changeSkus(skuOptions))
            } else {
              const skus = values.map((i) => i.value)
              setLocalSkus(skus)
              dispatch(changeSkus(skus))
            }
          }}
        />
      </fieldset>
      <div className={styles.formButtonsContainer}>
        <ResetBtn
          handleClick={() => {
            dispatch(changeShops([]))
            dispatch(changeGroups([]))
            dispatch(changeCategories([]))
            dispatch(changeSubcategories([]))
            dispatch(changeSkus([]))
            setLocalSkus([])
          }}
        />
        <ForecastBtn />
      </div>
    </form>
  )
}

export default Form