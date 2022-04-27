import React, {useEffect, useState} from 'react';
import {ethers} from 'ethers';

import { contractABI, contractAddress } from '../utils/constants';

export const TransactionContext = React.createContext();

const { ethereum } = window;

const getEthereumContract = ()=>{
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const transactionsContract = new ethers.Contract(contractAddress, contractABI, signer);

    return transactionsContract;
}

export const TransactionProvider = ({children})=>{

    const [currentAccount,setCurrentAccount] = useState("");
    const [formData,setFormData] = useState({addressTo:'',amount:'',keyword:'',message:''});
    const [isLoading, setIsLoading] = useState(false);
    const [transactionCount,setTransactionCount] = useState(localStorage.getItem('transactionCount'));

    const handleChange = (e,name) =>{
        setFormData((prevState) => ({ ...prevState, [name]: e.target.value }));
    }

    const checkIfWalletisConnected = async () => {
        
        try {
            if(!ethereum) return alert("please install metamask");

            const accounts = await ethereum.request({method:'eth_accounts'});

            if(accounts.lengthen) {
                setCurrentAccount(accounts[0]);

                //getALLTransactions();
            } else {
                console.log("No accounts found");
            }
        }
        catch (err) {
            console.log(e);

            throw new Error("No ethereum object.");
        }
    }

    const connectWallet = async () =>{
        try {
            if(!ethereum) return alert("please install metamask");

            const accounts = await ethereum.request({method:'eth_requestAccounts'});

            setCurrentAccount(accounts[0]);
        }
        catch(e) {
            console.log(e);

            throw new Error("No ethereum object.");
        }
    }

    const sendTransaction = async () => {
        try{
            if(!ethereum) return alert("please install metamask");

            const {addressTo, amount, keyword, message} = formData;

            const transactionContract = getEthereumContract();
            const parsedAmount = ethers.utils.parseEther(amount);

            await ethereum.request({
                method: 'eth_sendTransaction',
                params: [{
                    from: currentAccount,
                    to: addressTo,
                    gas: '0x5208', //2100 GWEI 0.000021 eth
                    value: parsedAmount._hex,
                }]
            });

            const transactionHash = await transactionContract.addAllBlockchain(addressTo, parsedAmount, message, keyword);

            setIsLoading(true);
            console.log(`Loading - ${transactionHash.hash}`);
            await transactionHash.wait();
            setIsLoading(false);
            console.log(`sucess - ${transactionHash.hash}`);

            const transactionCount = await transactionContract.getTransactionsCount();

            setTransactionCount(transactionCount.toNumber());

        }
        catch(e) {
            console.log(e);

            throw new Error("No ethereum object.");
        }
    }

    useEffect(() => {
        checkIfWalletisConnected();
    },[]);

    return(
        <TransactionContext.Provider value={{ connectWallet : connectWallet, currentAccount,formData,setFormData,handleChange,sendTransaction}}>
            {children}
        </TransactionContext.Provider>
    );
}

