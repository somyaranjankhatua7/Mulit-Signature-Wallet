"use client"

import React, { useState } from 'react'
import CreateInputSection from './CreateInputSection'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { chainData } from './chainAsset';
import { useSelector } from 'react-redux';
import { Avatar, CircularProgress } from '@nextui-org/react'
import {Alert, AlertTitle} from '@mui/material';

const steppers = [
    { id: 1, name: "Select network and name of your Safe Account", description: "Select the network on which to create your Safe Account" },
    { id: 2, name: "Owners and confirmations", description: "Set the owner wallets of your Safe Account and how many need to confirm to execute a valid transaction." },
    { id: 3, name: "Review", description: "You're about to create a new Safe Account and will have to confirm the transaction with your connected wallet." }
]

const CreateBoxStepper = () => {
    const [stepperCount, setStepperCount] = useState(0);
    const [chain, setChain] = useState(0);
    const [onChain, setOnChain] = useState(false);

    const { clientSigner, signer } = useSelector(state => state.connectWalletReducer.user);
    const [showNameError, setShowNameError] = useState(false);
    const [showError, setShowError] = useState(false);
    const [transactionLoader, setTransactionLoader] = useState(false);
    const [txerror,setTxerror] = useState(false);


    const deployer_contract = "osmo102p7faygl6h0egm5qlxh67vq6ux60felxzh2ys3z2dwfj7a52l2slpq8vh";

    const [userWalletData, setUserWalletData] = useState({
        walletName: "",
        threshold: "",
        maxVotingPeriod: "",
        owners: [
            {
                name: "Owner",
                address: "0xabc",
                weight: "55"
            }
        ]
    });

    const handleInputName = (e) => {

        const { name, value } = e.target;
        setUserWalletData(prev => ({
            ...prev,
            [name]: value
        }));


    };

    const ownersWithEmptyFields = userWalletData.owners.filter(owner => (
        (!owner.name || owner.name.trim() === '') &&
        (!owner.address || owner.address.trim() === '') &&
        (!owner.weight || owner.weight === '')
    ));
    console.log(ownersWithEmptyFields)
    const voteValidation = stepperCount > 0 && (!userWalletData.maxVotingPeriod);

    const thresholdValidation = stepperCount > 0 && (!userWalletData.threshold);


    const handle = async () => {

        let currentTime = Math.floor(Date.now() / 1000);

        if (userWalletData.walletName.trim() === '') {
            console.log("Wallet name should be a non-empty.");
            setShowNameError(true);
            return;
        }


        if (stepperCount == 1 && ownersWithEmptyFields.length > 0) {
            console.log(ownersWithEmptyFields, "Owner fields should not be empty.");
            setShowError(true);
            return;
        }

        if (voteValidation || thresholdValidation) {
            console.log("Vote or Threshold should be  non-empty.");
            setShowError(true);
            return;
        }

        if (stepperCount == 2 || "tx_condition") {
            setTransactionLoader(true)
        }

        stepperCount >= 2 ? setStepperCount(stepperCount) : setStepperCount(stepperCount + 1);

        if (stepperCount == 1) {
            console.log(userWalletData);
            console.log("Hello World")
            if (clientSigner && signer) {
                console.log("transaction")
                const deploy_msg = {
                    members: userWalletData?.owners,
                    threshold_weight: userWalletData?.threshold,
                    max_voting_period: currentTime + (userWalletData?.maxVotingPeriod * 24 * 60 * 60),
                }
                const transaction = await clientSigner.execute(
                    signer,
                    deployer_contract,
                    {
                        deployer: {
                            Deployer: deploy_msg
                        }
                    },
                    "auto"
                )

                console.log("tx", transaction)
            }
        }
    }

    return (
        <div className='w-[80%] bg-white rounded-md border shadow-xl'>
            <div className='flex justify-start items-start border-b-gray-300 border-b px-3 py-5 bg-white text-black rounded-lg'>
                <span className='border bg-black text-white flex justify-center items-center w-6 h-6 rounded-full mr-4 mt-2 '>{stepperCount + 1}</span>
                <div>
                    <h3 className='font-semibold text-[18px]'>{steppers[stepperCount].name}</h3>
                    <p className='text-[12px]'>{steppers[stepperCount].description}</p>
                </div>
            </div>
            <div>
                {


                    stepperCount === 0 ?
                        <>
                            <div className=' relative flex items-center px-3 py-5 gap-4 '>


                                <input name='walletName' onChange={(e) => handleInputName(e)}
                                    type="text" value={userWalletData.walletName}
                                    placeholder='Enter your multi signature account wallet name'
                                    className='outline-none border px-3 py-3 my-2 w-[50%] rounded realtive' />


                                <div>
                                    <div className="flex items-center justify-center border p-1 ml-2 rounded relative" onClick={() => setOnChain(true)} >
                                        <img src={chainData[chain].image} alt="" className="w-10 h-10" />
                                        <h3 className="font-semibold text-[13px]">{chainData[chain].name}</h3>
                                        {/* <HiChevronDown className="" /> */}
                                    </div>

                                    {onChain && <div className="border rounded absolute mt-2 bg-white">
                                        {
                                            chainData.map((item, index) => {
                                                return (
                                                    <div className="flex justify-between items-center bg-green-100 m-2" onClick={() => {
                                                        setChain(index);
                                                        setOnChain(false);
                                                    }} key={index} >
                                                        <img src={item.image} alt="" className="w-10 h-10" />
                                                        <h3 className="font-semibold text-[13px] pr-3">{item.name}</h3>
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>}

                                </div>

                            </div>
                            {showNameError && userWalletData.walletName === "" && (
                                <div className="absolute -mt-6">
                                    <p className="text-red-500 ml-4 text-xs font-normal text-gray-500 hover:underline">
                                        <HelpOutlineIcon className='w-3 h-3 mr-2' />
                                        Please Enter a Wallet name.</p>
                                </div>
                            )}
                        </>
                        : stepperCount === 1 ?
                            <div>
                                <CreateInputSection state={userWalletData} setState={setUserWalletData} />
                                {showError && stepperCount > 0 && (
                                    <div className="absolute -mt-6">
                                        <p className="text-red-500 ml-4 text-xs font-normal text-gray-500 hover:underline">
                                            <HelpOutlineIcon className='w-3 h-3 mr-2' />
                                            Please Check Entered Data Again.</p>
                                    </div>
                                )}
                            </div>
                            :
                            <div className="flex flex-col items-center justify-center h-[55vh] gap-2">
                                <div className="mx-auto">
                                    <table className="border-collapse w-[50vw] h-[40vh]">
                                        <tbody>
                                            <tr className="border-b">
                                                <td className="py-2 px-4 font-semibold">Network</td>
                                                <td className="py-2 px-4">Osmosis</td>
                                            </tr>
                                            <tr className="border-b">
                                                <td className="py-2 px-4 font-semibold">Name</td>
                                                <td className="py-2 px-4">Sam</td>
                                            </tr>
                                            <tr className="border-b">
                                                <td className="py-2 px-4 font-semibold">Owners</td>
                                                <td className="py-2 px-4">
                                                    <div className="flex items-center space-x-2 gap-6">
                                                        <Avatar name="Sam" size="md" isBordered radius="full" />
                                                        <p className="font-light">0xgavsdgavsgdvasgdv</p>
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="py-2 px-4 font-semibold">Threshold</td>
                                                <td className="py-2 px-4">
                                                    <p>
                                                        <span className="font-semibold">1</span>
                                                        <span> out of </span>
                                                        <span className="font-semibold">1</span>
                                                    </p>
                                                </td>
                                            </tr>
                                            {/* <Alert severity="error">
                                    <AlertTitle>Error</AlertTitle>
                                    This is an error alert — <strong>check it out!</strong>
                                </Alert>
                                <Alert severity="success">
                                    <AlertTitle>Success</AlertTitle>
                                    This is a success alert — <strong>check it out!</strong>
                                </Alert> */}
                                        </tbody>
                                    </table>
                                </div>

                                <div className="flex items-center justify-center p-4">
                                    {!transaction ? (
                                        <div className="text-gray-400 z-20" >
                                            <CircularProgress color="default" aria-label="Loading..." label="Transacting..." />
                                        </div>
                                    ) : null}
                                </div>
                              
                            </div>
                }
            </div>

            <div className='px-3 py-5 border-t flex items-center justify-between'>
                {
                    stepperCount > 0 &&
                    <button className='border py-2 w-[130px] rounded bg-gray-950 text-white' onClick={() => stepperCount <= 0 ? setStepperCount(stepperCount) : setStepperCount(stepperCount - 1)}>Back</button>
                }
                <button className='border py-2 w-[130px] rounded bg-gray-950 text-white' onClick={handle}>Next</button>
            </div>
        </div>
    )
}

export default CreateBoxStepper