import React from 'react'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import '../css/Tasks.css'

function Tasks() {
    return (
        <div style={{ height: '100%' }}>
            <Navbar />
            <div style={{ display: 'flex', height: '100%', backgroundColor: "#f5f5f5" }}>
                <Sidebar />
                <div style={{ marginLeft: "68px", display: "flex", flexDirection: "column", width: "100%", padding: "5%", marginTop: "56px" }}>
                    <div style={{ backgroundColor: "white", borderRadius: "2%", paddingBottom: "4%" }}>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Tasks
