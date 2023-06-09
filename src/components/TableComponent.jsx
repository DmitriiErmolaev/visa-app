import React, {useState,useEffect} from 'react';
import {Table, Spin} from "antd";
import {columns} from "../table-columns-config";
import {getCountFromServer, collection, query} from "firebase/firestore";
import {firestore} from "../firebase";
import {TABLE_PAGE_ITEMS_NUMBER} from "./ApplicationsTable"

const total = (total, range)=>{
  let first = `${range[0]} - ${range[1]}`
  let second = ` из ${total}`
  return first + second;
}

const paginationDoc = {
  // current: 1,
  defaultCurrent: 1,
  defaultPageSize: 10, 
  position: ["bottomCenter ", "topCenter "],
  showTotal: total,
}

const TableComponent = ({dirstDocRef, lastDocRef,setFirstApplicationRef, setLastApplicationRef, tableLoading, array, handleTableChange, setColumnSorting, tableDataBeforeChanging, queryForAppsWithoutLimit, setCurTablePage}) => {
  // console.log(appsCollectionSize)
  const [columnsSettings, setColumnsSettings] = useState(columns)
  const [paginationSettings, setPaginationSettings] = useState(paginationDoc)
  // const [totalApps, setTotalApps] = useState();

  // useEffect(()=>{
  //   getTotalApps()
  // },[])

  // const getTotalApps = async () => {
  //   const aggregSnapshot = await getCountFromServer(queryForAppsWithoutLimit);
  //   setPaginationSettings({...paginationSettings, "total": aggregSnapshot.data().count});
  //   console.log(aggregSnapshot.data()) 
  // }

  function handleTableChange(pagination, filters, sorter, {action}){
    console.log(action)
    if(action === "paginate") {

      // setCurTablePage(pagination.current)
      // setFirstApplicationRef(dirstDocRef)
      // setLastApplicationRef(lastDocRef)
      // console.log(pagination)
    } else {
      let sortOrder = "asc";
      if(sorter.order === "descend") {
        sortOrder = "desc"
      }
      if (sorter.order === undefined){
        sortOrder = null
      }

      setColumnSorting({
          column: sorter.columnKey, 
          order: sortOrder
      })

      setColumnsSettings(columnsSettings.map(col => {
        if((col.key !== sorter.columnKey) && col.sortOrder) {
          return {...col, sortOrder: undefined}
        }
        if(col.key === sorter.columnKey) {
          return {...col, sortOrder: sorter.order}
        }
        return col
      }))
    }
  }

  if (tableLoading) {
    return (
      <Table 
        loading={<Spin size="large"></Spin>}
        dataSource={tableDataBeforeChanging} 
        columns={columnsSettings} 
        sticky 
        pagination={paginationSettings} 
        onChange={handleTableChange} 
        rowKey={(record) => record.id}
      />
    )
  }

  return (
    <Table 
      dataSource={array} 
      columns={columnsSettings} 
      sticky 
      pagination={paginationSettings} 
      onChange={handleTableChange} 
      rowKey={(record) => record.id}
    />
  );
};

export default TableComponent;