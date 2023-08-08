'use state'

import { useState, useEffect } from 'react';
// create simple form to get database name, apikey, and connection key

export default function FirstTimeSignIn()  {
    const [database, setDatabase] = useState('');
    const [connectionKey, setConnectionKey] = useState('');
    const [OnlineEnabled, setOnlineEnabled] = useState(true);
    const [url, setUrl] = useState('');

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
    const handleSubmit = (e: any) => {
        e.preventDefault();
        localStorage.setItem('database', database);
        localStorage.setItem('connectionKey', connectionKey);
        localStorage.setItem('OnlineEnabled', OnlineEnabled);
        localStorage.setItem('url', url);
        window.location.href = '/';
    };

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


