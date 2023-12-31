import React, {useState, useEffect, useCallback} from 'react';
import { useDojo } from "../../DojoContext";
import { addressShortener } from '../../utils';
//import { ClickWrapper } from '../../ui/clickWrapper';
import { ETH_ADDRESS, LORDS_ADDRESS } from '../../constants';
import erc20abi from '../../constants/abi/erc20.json';
import { Contract, RpcProvider, uint256, Account } from 'starknet';
import { ethers } from 'ethers';

export const Navbar = () => {

    const [useDemoWallet, setUseDemoWallet] = useState(true);
    
    const {
        account: {
            create,
            list,
            get,
            account,
            select,
            isDeploying
        }
    } = useDojo();
    
    const [ethBalance, setEthBalance] = useState(0.00);
    const [lordsBalance, setLordsBalance] = useState(0.00);

    const provider = new RpcProvider({
        //nodeUrl: import.meta.env.VITE_PUBLIC_NODE_URL!,
        nodeUrl: import.meta.env.VITE_PUBLIC_NODE_URL!,
    });
    const masterAccount = new Account(provider, import.meta.env.VITE_PUBLIC_DEMO_MASTER_ADDRESS!, import.meta.env.VITE_PUBLIC_DEMO_MASTER_PRIVATE_KEY!);
    
    const demoAccount = useDemoWallet ? masterAccount: account; // see if use which wallet

    const ethERC20 = new Contract(erc20abi, ETH_ADDRESS, provider);
    const lordsERC20 = new Contract(erc20abi, LORDS_ADDRESS, provider);

    const createBurner = useCallback(() => {
        list().length > 0 ? null :
        create()
        console.log("burner created")
    }, [create, list])

    const toggleUseDemoWallet = useCallback(() => {
        setUseDemoWallet(!useDemoWallet)
    }, [useDemoWallet])

    useEffect(() => {
        if (!demoAccount) return;

        async function getBalance(erc20:Contract, setter:React.Dispatch<React.SetStateAction<number>>) {
            erc20.connect(demoAccount);
            const walletbalance = await erc20.balanceOf(demoAccount.address);
            setter(parseFloat(ethers.utils.formatEther(uint256.uint256ToBN(walletbalance.balance))))
        }
        

        const interval = setInterval(() => { 
            getBalance(ethERC20, setEthBalance);
            getBalance(lordsERC20, setLordsBalance);
        }, 1000);
    
        return () => clearInterval(interval);

    }, [demoAccount, list, ethERC20, lordsERC20])

    return (
        <nav className="fixed z-50 w-full bg-transparent py-5
        ">
            {/* <ClickWrapper> */}
            <div className="xl:w-[50vw] mx-auto flex flex-row 
                items-center justify-center h-16 text-gray-900
                border rounded-lg border-gray-600/80
                py-8
            ">
                
                <div className="flex flex-row justify-start items-center
                mx-1
                ">  
                    <img src="/starkicon.png" alt="logo" className="w-14 h-14 mx-2"/>
                    <img src="/taxiRight.png" alt="logo" className="w-16 h-16 mx-2"/>
                    <span className="mx-2
                    2xl:font-bold
                    text-xs 2xl:text-base
                    ">Stark Taxi & Gas</span>
                    <img src="/cuteRobot2.png" alt="logo" className="w-14 h-14 mx-2"/>
                </div>
                
                <div className="
                    bg-[#DBB874]
                    rounded-lg mx-1
                    px-4 py-1.5 
                    2xl:font-bold
                    text-xs 2xl:text-base
                    ">
                        $LORDS: {parseFloat(lordsBalance.toString()).toFixed(1)}</div>
                <div className="
                    bg-purple-400/80
                    rounded-lg mx-1
                    px-4 py-1.5 
                    2xl:font-bold
                    text-xs 2xl:text-base
                    "
                    >
                        $ETH: {parseFloat(ethBalance.toString()).toFixed(6)}</div>


                {/* FOR BUTTON KEEPS: onClick={()=>createBurner()} */}
                <button className="
                    bg-[#28286B] text-red-500
                    rounded-lg
                    px-4 py-1.5 
                    mx-1 mr-7
                    2xl:font-bold
                    text-xs 2xl:text-base
                "

                > { 
                
                list().length > 0 ?
                addressShortener(demoAccount.address) :
                "Create Burner"
                } </button>
            </div>
            {/* </ClickWrapper> */}
        </nav>
    )
}