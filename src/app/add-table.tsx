'use client'
import { useState } from 'react';
import '@component/app/globals.css';
import Link from 'next/link';
//import { count } from 'console';
import React from "react";

export default function AddTable() {
  interface Column {
    name: string;
    dataType: string;
  }

    interface ParsedSchema {
      [key: string]: {
        table_name: string;
        columns: Array<string>;
        constraint_column:string;
        constraints:string;
        table_schema:string;
        types:Array<string>;
      };
    }
  const [useGPS, setUseGPS] = useState(false);
  const [tableName, setTableName] = useState('');
  const [columns, setColumns] = useState<Column[]>([{ name: '', dataType: '' }]);
  const [errorMessage, setErrorMessage] = useState('');

    async function handleDBSchemaDownload (event) {
    event.preventDefault();
    console.log("download schema");
    let database=localStorage.getItem('database');

    let storedApiKey = localStorage.getItem('connectionKey');


        
    const url=`http://localhost:8080/querydatabase/${database}&expand=true&apikey=${storedApiKey}`;

    
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'text/json',
            }
    });

        const parsedSchema: ParsedSchema = await response.json();
        console.log(parsedSchema);
        let newdbshema = parsedSchema;
        console.log(newdbshema);
        localStorage.setItem('dbschema', JSON.stringify(parsedSchema));
        console.log(localStorage.getItem('dbcshema'));

        if (parsedSchema){
        let tablenameArray:Array<string>=[];
        Object.keys(parsedSchema).forEach((table) => {
          const tabledet = parsedSchema[table];

          const tablename=tabledet.table_name;
          console.log(`Table Name: ${tablename}`);
          tablenameArray.push(tablename);
          localStorage.setItem(`${tablename}_columns`, JSON.stringify(tabledet.columns));
          localStorage.setItem(`${tablename}_types`, JSON.stringify(tabledet.types));

        });
        localStorage.setItem('tables', JSON.stringify(tablenameArray));
            //window.location.href = '/';
            return newdbshema;

        }
            
        };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {

    
    event.preventDefault();
    if (tableName === '' || columns.some((column) => column.name === '' || column.dataType === '')) {
      setErrorMessage('Please fill out all fields.');
      return;
    }
    console.log(tableName);
    
    let countArray=[];
    for (let i=0; i<columns.length; i++){

      let string="col"+(i+1).toString();
      console.log(string);
      countArray.push(string);
    }
    const columnsArray = columns.map((column) => column.name);
    const typesArray = columns.map((column) => column.dataType);

    const jsonObject = {
      columns: [Object.fromEntries(countArray.map((column,index) => [column, columnsArray[index]]))],
      types: [Object.fromEntries(countArray.map((column, index) => [column, typesArray[index]]))],

    }
    //let database="testfrontend";
    let database=localStorage.getItem('database');
    let json = JSON.stringify(jsonObject);
    console.log(json);
    //let gpsval="false";
    let gpsval=useGPS;
    //console.log(gpsval);
    console.log(localStorage.getItem('storedapiKey'));
    let storedApiKey = localStorage.getItem('storedapikey');
    //let storedApiKey="CEF7698E34DEBFB3BA467410EF57DC54932A828BDE93729730DC9FB396218631";


    const url = `http://localhost:8080/createtable/${database}&table=${tableName}&gps=${gpsval}&apikey=${storedApiKey}`;
    console.log(url); 

  // Send the HTTP request with the JSON body
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: json,
    });

    await handleDBSchemaDownload(event);
    console.log(response);
     

        

};

  const handleTableNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTableName(event.target.value);
  };
  const handleColumnNameChange = (event: React.ChangeEvent<HTMLInputElement>, index:number) => {
    const newColumns = [...columns];
    newColumns[index].name = event.target.value;
    setColumns(newColumns);
  };

  const handleDataTypeChange = (event: React.ChangeEvent<HTMLSelectElement>, index:number) => {
    const newColumns = [...columns];
    newColumns[index].dataType = event.target.value;
    setColumns(newColumns);
  };
  const handleAddRow = () => {
    setColumns([...columns, { name: '', dataType: '' }]);
  };
  const handleDeleteRow = (index: number) => {
    const newColumns = [...columns];
    newColumns.splice(index, 1);
    setColumns(newColumns);
  };
  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUseGPS(event.target.checked);

  };
    


  return (
    <div>
      <h1>Add a Table</h1>
      <form onSubmit={handleSubmit}>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
        <label>
          Table Name:
          <input type="text" value={tableName} onChange={handleTableNameChange} />
        </label>
        <table>
          <thead>
            <tr>
              <th>Column Name</th>
              <th>Data Type</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {columns.map((column, index) => (
              <tr key={index}>
                <td>
                  <input type="text" value={column.name} onChange={(event) => handleColumnNameChange(event, index)} />
                </td>
                <td>
                <select value={column.dataType} onChange={(event) => handleDataTypeChange(event, index)}>
                    <option value=""></option>
                    <option value="DOUBLE">Decimal</option>
                    <option value="INT">Integer</option>
                    <option value="VARCHAR(255)">String</option>
                    <option value="TEXT">Text</option>
                    <option value="DATE">Date</option>
                    <option value="DATETIME">Date/Time</option>
                    <option value="BOOLEAN">True/False</option>
                  </select>
                </td>
                <td>
                  <button type="button" onClick={() => handleDeleteRow(index)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <input type="checkbox" onChange={handleCheckboxChange} /> Use GPS

        <button type="button" onClick={handleAddRow}>Add Row</button>
        <button type="submit">Create Table</button>
      </form>
            <Link href="/" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" />
    </div>
  );
}
