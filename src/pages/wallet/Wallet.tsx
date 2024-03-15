import Box from "@mui/material/Box";
import { Tab, Tabs } from "@mui/material";
import React, { useEffect, useState } from "react";
import TabPanel from "../../base/TabPanel/TabPanel";
import Withdraw from "./components/Withdraw";
import './Wallet.scss'
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Web3Provider } from "../../contexts";
const Wallet = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [selectedIndex, setSelectedIndex] = useState(0);

    const tabs = [
        {
            index: 0,
            tabName: 'DEPOSIT',
            pathName: '/wallet/deposit'
        },
        {
            index: 1,
            tabName: 'WITHDRAW',
            pathName: '/wallet/withdraw'
        },
        {
            index: 2,
            tabName: 'TRANSACTION',
            pathName: '#'
        }
    ]

    const handleChange = (event: React.SyntheticEvent, selectedIndex: number) => {

        setSelectedIndex(selectedIndex);
        navigate(tabs[selectedIndex].pathName)
    };

    useEffect(() => {
        const tabValue = tabs.filter((item) => {
            return item.pathName === location.pathname
        })[0]?.index || 0
        setSelectedIndex(tabValue)
    }, [location.pathname]);

    const handleReceivedata = (data: number) => {
        setSelectedIndex(data)
        navigate(tabs[data].pathName)
    }
    return (
        <Web3Provider>
            <Box className={'layout-wallet'}>
                <Box sx={{ width: '100%', height: '64px', borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs className={'custom-tabs'} value={selectedIndex} onChange={handleChange} centered sx={{ height: '64px' }}>
                        {/* <Tab className={'tab-item'} label="Deposit" value={}/>
                        <Tab className={'tab-item'} label="Withdraw" />
                        <Tab className={'tab-item'} label="Transaction" /> */}
                        {tabs.map(item => {
                            return <Tab className={'tab-item'} label={item.tabName} key={'wallet-tab' + item.index}></Tab>
                        })}
                    </Tabs>

                </Box>
                <TabPanel value={selectedIndex} index={0}>
                    <Outlet />
                    {/* <Deposit /> */}
                </TabPanel>
                <TabPanel value={selectedIndex} index={1}>
                    <Withdraw emitTab={handleReceivedata} />
                </TabPanel>

            </Box>
        </Web3Provider>
    )
}
export default Wallet