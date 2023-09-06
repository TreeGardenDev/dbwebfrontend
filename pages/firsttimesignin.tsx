'use state'

import { useState, useEffect } from 'react';
// create simple form to get database name, apikey, and connection key

export default function FirstTimeSignIn() {
    const [database, setDatabase] = useState('');
    const [connectionKey, setConnectionKey] = useState('');
    const [OnlineEnabled, setOnlineEnabled] = useState(true);
    const [url, setUrl] = useState('');
    interface ParsedSchema {
        [key: string]: {
            table_name: string;
            columns: Array<string>;
            constraint_column: string;
            constraints: string;
            table_schema: string;
            types: Array<string>;
        };
    }


    useEffect(() => {
        const storedDatabase = localStorage.getItem('database');
        if (storedDatabase) {
            setDatabase(storedDatabase);
        } else {
        }
        const storedconnectionKey = localStorage.getItem('connectionKey');
        if (storedconnectionKey) {
            setConnectionKey(connectionKey);
        } else {
        }
        const url = localStorage.getItem('url');
        if (url) {
            setUrl(url);
        } else {
        }
    }, []);

    const handleDatabaseChange = (e: any) => {
        setDatabase(e.target.value);
    };
    const handleConnectionKeyChange = (e: any) => {
        setConnectionKey(e.target.value);
    };
    const handleOnlineEnabledChange = (e: any) => {
        setOnlineEnabled(e.target.value);
    };
    const handleUrlChange = (e: any) => {
        setUrl(e.target.value);
    };
    //const handleSubmit = (e: any) => {
    //    e.preventDefault();
    //    localStorage.setItem('database', database);
    //    localStorage.setItem('connectionKey', connectionKey);
    //    localStorage.setItem('OnlineEnabled', OnlineEnabled);
    //    localStorage.setItem('url', url);
    //    window.location.href = '/';
    //};

    const handleDBSchemaDownload = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        let connectionKey = localStorage.getItem('connectionKey');
        let url = `http://localhost:6969/querydatabase/${database}&expand=true&apikey=${connectionKey}`;
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'text/json',
            }
        });
        let json = await response.json();
        localStorage.setItem('dbschema', JSON.stringify(json));
        console.log(json);
        return json;
    };
    const BuildTable = (tableName: string, fulltable: Object) => {
        //build table from Interfa  
        //set loacl storage in table subfolder
        //
        localStorage.setItem(`table/${tableName}`, JSON.stringify(fulltable));
        console.log(fulltable);
    }
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        localStorage.setItem('database', database);
        localStorage.setItem('connectionKey', connectionKey);
        localStorage.setItem('online', OnlineEnabled.toString());
        localStorage.setItem('url', url);


        let geturl = `http://${url}/getkey/${database}&apikey=${connectionKey}`;

        const response = await fetch(geturl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        let json = await response.json();
        localStorage.setItem('storedapikey', json.APIKey);

        const dbshema = await handleDBSchemaDownload(event);
        console.log(dbshema);
        const dbschemaString = localStorage.getItem('dbschema');

        const parsed: ParsedSchema | null = dbschemaString ? JSON.parse(dbschemaString) : null;

        if (parsed) {
            let tablenameArray: Array<string> = [];
            Object.keys(parsed).forEach((table) => {
                const tabledet = parsed[table];

                const tablename = tabledet.table_name;
                console.log(`Table Name: ${tablename}`);
                BuildTable(tablename, tabledet);
                tablenameArray.push(tablename);
                localStorage.setItem(`${tablename}_columns`, JSON.stringify(tabledet.columns));
                localStorage.setItem(`${tablename}_types`, JSON.stringify(tabledet.types));

            });
            localStorage.setItem('tables', JSON.stringify(tablenameArray));
            window.location.href = '/';
        };
    }
    return (
        <div className="container">
            <div className="row">
                <div className="col-md-12">
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="url">URL</label>
                            <input
                                type="text"
                                className="form-control"
                                id="url"
                                value={url}
                                onChange={handleUrlChange}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="database">Database Name</label>
                            <input
                                type="text"
                                className="form-control"
                                id="database"
                                value={database}
                                onChange={handleDatabaseChange}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="connectionKey">Connection Key</label>
                            <input
                                type="text"
                                className="form-control"
                                id="connectionKey"
                                value={connectionKey}
                                onChange={handleConnectionKeyChange}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="OnlineEnabled">Online Enabled</label>
                            <input
                                type="text"
                                className="form-control"
                                id="OnlineEnabled"
                                value={OnlineEnabled}
                                onChange={handleOnlineEnabledChange}
                            />
                        </div>
                        <button type="submit" className="btn btn-primary">
                            Submit
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );

}


