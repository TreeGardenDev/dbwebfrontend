 'use client'
 import { useState, useEffect } from 'react';
 import Image from 'next/image'
 import Link from 'next/link'
 //import '@component/app/globals.css';
import React from "react";
import Popup from 'reactjs-popup';
import './style.css';
import { Html } from 'next/document';
export default function InsertRecords() {
  const [table, setTable] = useState('');
  const [tableSchema, setTableSchema] = useState<TableSchema | null>(null);
  const [records, setRecords] = useState<any[]>([]);
  const [tables, setTables] = useState<string[]>([]);
  const [attachments, setAttachments] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);
 const [recordSelected, setRecordSelected] = useState<any>(null);
 const [selectedRecord, setSelectedRecord] = useState<{ [key: string]: string } | null>(null);

 
  const togglePopup = () => {
    console.log(recordSelected);
    setIsOpen(!isOpen);
  }
  




  useEffect(() => {
    // Fetch the tables from local storage
    const fetchTables = async () => {
      const tablesString = localStorage.getItem('tables');

      if (tablesString) {
        let tables = JSON.parse(tablesString);
        //do not show tables that end with _GPS
        tables = tables.filter((table) => !table.endsWith('_GPS'));
        setTables(tables);
      }
    };

    fetchTables();
  }, []);

  useEffect(() => {
    // Fetch the table schema from local storage

const fetchTableSchema = async () => {
  const columnsString = localStorage.getItem(`${table}_columns`);
  const typesString = localStorage.getItem(`${table}_types`);
  const recordsString = localStorage.getItem(`${table}_records`);
  //console.log(recordsString);
  const database = localStorage.getItem('database');
  const apiKey = localStorage.getItem('storedapikey');
  const uploadurl = `/upload/${table}`;

  if (columnsString && typesString && recordsString) {
    const columns = JSON.parse(columnsString);
    const types = JSON.parse(typesString);
    let recordarray = [];
    let records = JSON.parse(recordsString);
    //turn into array
    //for (let i = 0; i < records.length; i++) {
    //    recordarray.push(records[i]);
    //    }
    Object.keys(records).forEach((index: any) => {
        //console.log(records[index]);
        recordarray.push(records[index]);
        });

        
        
    //for (let i = 0; i < records.length; i++) {
    //  recordarray.push(records[i]);
    //}

    //if (!Array.isArray(records)) {
    //  records = [];
    //}
    //console.log(records);

    const tableSchema = {
      columns: columns.map((name, index) => ({
        name,
        type: types,
      })),
    };

    setTableSchema(tableSchema);
    setRecords(recordarray);
  }
};
    if (table) {
      fetchTableSchema();
    }
  }, [table]);

const setRecord = (record: string) => {
    return setRecordSelected(record);
    };
const Popup = props=> {
    const tablename:string = table;
  return (
    <div className="popup-box">
      <div className="box">
        <label value={tablename}>Table Name: {tablename}</label>
        <span className="close-icon" onClick={props.handleClose}>x</span>
        {props.content}
      </div>
    </div>
  );
};

  const handleTableChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setTable(event.target.value);
    const uploadurl = `/upload/${event.target.value}`;
  };


  const handleAddRecord = () => {

    setRecords([...records, {}]);

  };

  const handleDeleteRecord = (index: number) => {
    setRecords(records.filter((_, i) => i !== index));
  };
  const handleAddAttachment=(index:number)=>{
    console.log("add attachment");

    

    };

  const handleRecordChange = (index: number, column: string, value: any) => {
    console.log("Record Change");
    setRecords((prevRecords) =>
      prevRecords.map((record, i) => {
        if (i === index) {
          setRecordSelected(record);
          return { ...record, [column]: value };
        } else {
          return record;
        }
      })
    );
  };

  const handleSubmit = async () => {
    
    let apiKey = localStorage.getItem('storedapikey');
    let database = localStorage.getItem('database');
    let postdata = [];
    //console.log(records);
    for (let i = 0; i < records.length; i++) {
     // console.log(records[i]);
     // console.log(Object.keys(records[i]));
        if (!(records[i]).hasOwnProperty('INTERNAL_PRIMARY_KEY')){
            postdata.push(records[i]);
        }
      }



    try {
      const response = await fetch(`http://localhost:8080/insert/${database}&table=${table}&apikey=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postdata)
      });
      if (response.ok) {
        console.log('Records inserted successfully');
      } else {
        console.error('Failed to insert records:', response.statusText);
      }
    } catch (error) {
      console.error('Failed to insert records:', error);
    }
  };

  return (
    <div>
   
      <h1>Insert Records</h1>
      <form>
        <br />
        <label>
          Table:
          <select value={table}  onChange={handleTableChange}>
            <option value="">Select a table</option>
            {tables.map((table) => (
              <option key={table} value={table}>
                {table}
              </option>
            ))}
          </select>
        </label>
        <br />
        <br />
        {tableSchema && (
          <table>
            <thead>
              <tr >
                {tableSchema.columns.map((column:any) => (
                  <th key={column.name}>{column.name}</th>
                ))}
              </tr>
            </thead>
            <tbody>

              {
              records.map((record, index) => (
              
                <tr key={index}>
                  {tableSchema.columns.map((column:any) => (
                   
                    <td key={column.index}>
                      <input
                        type="text"
                        value={record[column.name] || ''}
                        onChange={(event) => handleRecordChange(index, column.name, event.target.value)}
                        disabled={column.name === 'INTERNAL_PRIMARY_KEY'}
                      />
                    </td>
                  ))}
                  <td>
                    <button type="button" onClick={() => handleDeleteRecord(index)}>
                      Delete
                    </button>
                  </td>
                    <input
                    type="button"
                    value="Add Attachment"
                    onClick={togglePopup}
                  />
                  {isOpen && <Popup
                    content={<>
                      <br/>
                      <b>Selected Record:</b>
                      <br />
                        <p>{JSON.stringify(recordSelected)}</p>
                        <form onSubmit={handleAddAttachment}>
                        <input type="file" name="file" onChange={handleAddAttachment} />
                        <input type="submit" value="Submit" />
                        </form>

                      <button>Test button</button>
                    </>}
                    handleClose={togglePopup}
                  />}
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <br />
        <button type="button" onClick={handleAddRecord}>
          Add Record
        </button>
        <button type="button" onClick={handleSubmit}  >
          Submit
        </button>
      </form>
      <Link href="/" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
      return to home
    </Link>
    </div>
  );
}
