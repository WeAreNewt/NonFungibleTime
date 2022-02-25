import { Dialog } from "@headlessui/react";
import makeBlockie from "ethereum-blockies-base64";
import { useState } from "react";
import { FaClipboardCheck, FaCopy, FaShareAlt } from "react-icons/fa";
import { formatEns, formatEthAddress } from "../../lib/helpers/format";
import { useViewportProvider } from "../../lib/providers/viewport-provider";
import { Button, ButtonVariant } from "../Button";
import MintModal from "../MintModal";

interface ProfileHeaderParams {
    profileAddress: string;
    profileENS?: string;
    owner: boolean;
    mintPathSet: boolean;
}

export function ProfileHeader({ profileAddress, profileENS, owner, mintPathSet }: ProfileHeaderParams) {

    const [shareProfileModalOpen, setShareProfileModalOpen] = useState<boolean>(false);
    const [mintModalOpen, setMintModalOpen] = useState<boolean>(mintPathSet);
    const [copyClicked, setCopyClicked] = useState<boolean>(false);
    const { width } = useViewportProvider();
    // The width below which the mobile address view
    const breakpoint = 650;
    // max ens name length
    const maxLength = width < breakpoint ? 20 : 40;

    const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

    const copyClick = async () => {
        navigator.clipboard.writeText(profileAddress);
        setCopyClicked(true);
        await delay(500);
        setCopyClicked(false);
    }
    return (
        <div className="flex flex-row flex-wrap lg:flex-nowrap gap-4 justify-between items-center pb-4">
            {/** Profile Header */}
            <div className="w-full justify-items-center md:justify-items-start">
                <div className="flex flex-row justify-center items-center gap-4">
                    {/** Avatar/Blockie */}
                    <img
                        alt="blockie or ens avatar"
                        src={makeBlockie(profileAddress)}
                        className="rounded-full w-20 lg:w-30 xl:w-40"
                    />
                    {/** ENS Name/Address */}
                    {
                        profileENS ?
                            <div className="flex flex-col">
                                {profileENS && <div className="text-black dark:text-white tracking-widest font-semibold">{formatEns(profileENS, maxLength)}</div>}
                                <div className="text-gray-500 dark:text-gray-200 tracking-widest flex items-center">{width < breakpoint ? formatEthAddress(profileAddress) : profileAddress}
                                    {copyClicked ? <FaClipboardCheck className="text-green-500 ml-2" /> : <FaCopy onClick={() => copyClick()} className="cursor-pointer ml-2" />}
                                </div>
                            </div> :
                            <div className="text-black dark:text-white tracking-widest font-semibold flex items-center ">{width < breakpoint ? formatEthAddress(profileAddress) : profileAddress}
                                {copyClicked ? <FaClipboardCheck className="text-green-500 ml-2" /> : <FaCopy onClick={() => copyClick()} className="cursor-pointer ml-2" />}
                            </div>
                    }
                </div>
            </div>
            {/** Share Profile */}
            <div className="flex md:px-5 w-full py-2 justify-center lg:justify-end ">
                <div className="flex gap-4 flex-1 py-2 justify-center lg:flex-initial  ">
                    <Button
                        variant={ButtonVariant.SECONDARY}
                        onClick={() => setShareProfileModalOpen(true)}
                    >
                        <FaShareAlt /> Share Profile
                    </Button>
                    {/** Mint */}
                    {owner && (
                        <Button
                            onClick={() => {
                                setMintModalOpen(true);
                            }}
                        >
                            Mint new
                        </Button>
                    )}
                    {/** Mint Modal */}
                    <MintModal open={mintModalOpen} onClose={() => setMintModalOpen(false)} />
                    {/** Share Profile Modal */}
                    <Dialog
                        open={shareProfileModalOpen}
                        onClose={() => setShareProfileModalOpen(false)}
                        className="fixed z-10 inset-0 overflow-y-auto"
                        aria-labelledby="modal-title"
                        role="dialog"
                        aria-modal="true"
                    >
                        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                            <div
                                className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
                                aria-hidden="true"
                            ></div>

                            <span
                                className="hidden sm:inline-block sm:align-middle sm:h-screen"
                                aria-hidden="true"
                            >
                                &#8203;
                            </span>

                            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                    <div className="sm:flex sm:items-start">
                                        <div className="mt-3 text-center sm:mt-0 sm:ml-2 sm:text-left w-full">
                                            <h3
                                                className="text-lg leading-6 font-medium text-gray-900"
                                                id="modal-title"
                                            >
                                                Share Profile
                                            </h3>
                                            <div className="mt-2">
                                                <div>
                                                    <label
                                                        htmlFor="profile-link"
                                                        className="block text-sm font-medium text-gray-700"
                                                    >
                                                        Profile Link
                                                    </label>
                                                    <div className="mt-1 relative rounded-md shadow-sm">
                                                        <input
                                                            disabled={true}
                                                            type="text"
                                                            name="profile-link"
                                                            id="price"
                                                            className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
                                                            placeholder={window.location.href}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                    <button
                                        type="button"
                                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white sm:ml-3 sm:w-auto sm:text-sm"
                                        onClick={() => {
                                            navigator.clipboard.writeText(window.location.href);
                                        }}
                                    >
                                        Copy URL
                                    </button>
                                    <button
                                        type="button"
                                        className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                                        onClick={() => setShareProfileModalOpen(false)}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    )
}
