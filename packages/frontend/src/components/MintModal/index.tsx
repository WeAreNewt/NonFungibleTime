import { useEffect, useState } from 'react';
import { Dialog } from '@headlessui/react';
import { FaExternalLinkAlt, FaRegWindowClose } from 'react-icons/fa';
import { useAppDataProvider } from '../../lib/providers/app-data-provider';
import { MintParamsType } from '../../lib/helpers/NftCollection';
import { Input, Label, Select, baseInputClassNames } from '../../components/Forms';
import { TransactionResponse } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import { BigNumber } from 'ethers';
import { Category } from '../../types';
import classNames from 'classnames';
import DatePicker from 'react-datepicker';
import { required, inBetween, validateDate, greaterThanOrEqualTo } from '../../lib/utils/validators'
import Tooltip from '../Tooltip'
import ClockSpinner from '../../images/clock-loader.webp';

const validateDuration = greaterThanOrEqualTo(0.01)
const validateRoyalty = inBetween(0, 100)

interface Props {
  open: boolean,
  onClose: () => void
}

interface TxStatus {
  submitted: boolean;
  confirmed: boolean;
  txHash?: string;
}

interface MintNftParams {
  name: string;
  description: string;
  category: string;
  duration: number;
  availabilityTo: number;
  availabilityFrom: number;
  royalty: number;
}

type Errors = Record<string, string | undefined>

const defaultValues: MintNftParams = {
  name: '',
  description: '',
  category: '',
  duration: 1,
  availabilityTo: 0,
  availabilityFrom: 0,
  royalty: 0,
}

export default function MintModal({ open, onClose }: Props) {

  const [formNft, setFormNft] = useState<MintNftParams>(defaultValues);

  const [errors, setErrors] = useState<Errors>({})
  // For tx submission error, should not prevent user from resubmitting
  const [mainTxError, setMainTxError] = useState<string | undefined>(undefined);
  const [mintTxStatus, setMintTxStatus] = useState<TxStatus>({
    submitted: false,
    confirmed: false,
  });

  const { currentAccount, nftCollectionService, networkConfig } = useAppDataProvider();
  const { library: provider } = useWeb3React();

  useEffect(() => {
    setMintTxStatus({ submitted: false, confirmed: false, txHash: undefined });
  }, [])

  useEffect(() => {
    setFormNft(defaultValues)
    setErrors({})
  }, [open])


  const isValidForm = (errors: Errors) => !Object.keys(errors).some(key => errors[key] !== undefined)
  const triggerValidations = () => {
    const newErrors = {
      ...errors,
      name: required(formNft.name),
      description: required(formNft.description),
      category: required(formNft.category),
      duration: validateDuration(formNft.duration),
      date: validateDate(formNft.availabilityFrom, formNft.availabilityTo, formNft.duration),
      royalty: validateRoyalty(formNft.royalty)
    }
    setErrors(newErrors)
    return newErrors
  }
  const mintNft = async () => {
    if (!isValidForm(triggerValidations())) return
    if (currentAccount) {
      const input: MintParamsType = {
        userAddress: currentAccount,
        name: formNft.name,
        description: formNft.description,
        category: formNft.category,
        availabilityFrom: formNft.availabilityFrom,
        availabilityTo: formNft.availabilityTo,
        duration: formNft.duration * 3600, // in seconds
        royaltyBasisPoints: formNft.royalty * 100, // out of 10000
      };
      try {
        const txs = await nftCollectionService.mint(input);
        const tx = txs[0];
        const extendedTxData = await tx.tx();
        const { from, ...txData } = extendedTxData;
        const signer = provider.getSigner(from);
        const txResponse: TransactionResponse = await signer.sendTransaction({
          ...txData,
          value: txData.value ? BigNumber.from(txData.value) : undefined,
        });
        setMintTxStatus({ ...mintTxStatus, submitted: true });
        const receipt = await txResponse.wait(1);
        setMintTxStatus({ ...mintTxStatus, confirmed: true, txHash: receipt.transactionHash });
      } catch (error) {
        setMainTxError('Error submitting transaction (check browser console for full error):' + error);
      }
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      className="fixed z-10 inset-0 overflow-y-auto flex justify-center items-center bg-gray-500 bg-opacity-75 transition-opacity py-4 px-4"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white p-10 rounded-lg sm:max-w-lg">
        <div className="flex">
          <div className="w-full space-y-5">
            <div className="flex flex-row justify-between">
              <h3
                className="text-lg leading-6 font-semibold text-gray-900"
                id="modal-title"
              >
                Mint Time NFT
              </h3>
              <div className="cursor-pointer text-xl" onClick={onClose}>
                <FaRegWindowClose className="hover:text-red-500" />
              </div>
            </div>

            {mintTxStatus.submitted ? (
              <div className="text-center flex-col p-4">
                <div className="font-semibold">Transaction Submitted</div>
                <div className="w-1/5 mx-auto p-4 pb-0">
                  <img alt="clock spinner" src={ClockSpinner} width={50} height={50} />
                </div>
              </div>
            ) : mintTxStatus.confirmed ? (
              <div className="text-center flex-col">
                <div className="font-semibold">Transaction Confirmed</div>
                <div className="pt-4">
                  <a target="_blank" rel="noopener noreferrer" className="cursor-pointer p-5" href={networkConfig.blockExplorer + '/tx/' + mintTxStatus.txHash}>
                    View Transaction <FaExternalLinkAlt className="inline-block" />
                  </a>
                </div>
              </div>
            ) : (
              <div className="space-y-5">
                <div className="">
                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input
                      name="name"
                      id="name"
                      placeholder="Name for your service..."
                      value={formNft.name}
                      onChange={(e) => {
                        setFormNft({ ...formNft, name: e.target.value })
                        setErrors({ ...errors, name: required(e.target.value) })
                      }
                      }
                      error={errors.name}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Input
                    type="text"
                    name="description"
                    id="description"
                    placeholder="Describe your service..."
                    value={formNft.description}
                    onChange={(e) => {
                      setFormNft({ ...formNft, description: e.target.value })
                      setErrors({ ...errors, description: required(e.target.value) })
                    }
                    }
                    error={errors.description}
                  />
                </div>
                <div className="flex gap-4">
                  <div className="w-1/2">
                    <Label htmlFor="category">Category</Label>
                    <Select
                      id="category"
                      name="category"
                      className="focus:ring-indigo-500 focus:border-indigo-500 block w-full py-2 placeholder-gray-400 border-gray-300 rounded-md"
                      value={formNft.category}
                      onChange={(e) => {
                        setFormNft({ ...formNft, category: e.target.value })
                        setErrors({ ...errors, category: required(e.target.value) })
                      }
                      }
                    >
                      <option key={''} value="">-</option>
                      {Object.values(Category).sort().map((category, index) => (
                        <option key={index}>{category}</option>
                      ))}
                    </Select>
                    {errors.category && <span className="absolute text-xs text-red-500 pt-1">{errors.category}</span>}
                  </div>
                  <div className="w-1/2">
                    <Label>Number Of Hours</Label>
                    <Input
                      type="number"
                      name="numhours"
                      id="numhours"
                      placeholder="Add time..."
                      value={formNft.duration.toString()}
                      min={0}
                      onChange={(e) => {
                        const duration = parseInt(e.target.value)
                        setFormNft({ ...formNft, duration })
                        setErrors({
                          ...errors,
                          duration: validateDuration(duration),
                          date: validateDate(formNft.availabilityFrom, formNft.availabilityTo, duration)
                        })
                      }
                      }
                      error={errors.duration}
                    />
                  </div>
                </div>

                <div>
                  <Label>Beginning Of Availability (optional)</Label>

                  <div
                    className={classNames("md:w-14 md:h-7 w-12 h-6 flex items-center rounded-full p-1 cursor-pointer", { "bg-gray-300": formNft.availabilityFrom === 0 }, { "bg-indigo-500": formNft.availabilityFrom !== 0 })}
                    onClick={() => {
                      const availabilityFrom = formNft.availabilityFrom === 0
                        ? Math.floor(
                          Date.now() / 1000 - ((Date.now() / 1000) % 300)
                        )
                        : 0;
                      setFormNft({
                        ...formNft,
                        availabilityFrom
                      });
                      setErrors({
                        ...errors,
                        date: validateDate(availabilityFrom, formNft.availabilityTo, formNft.duration)
                      })
                    }}
                  >
                    <div
                      className={
                        classNames('bg-white md:w-6 md:h-6 h-5 w-5 rounded-full shadow-md transform', { 'transform translate-x-6': formNft.availabilityFrom !== 0 })
                      }
                    />
                  </div>

                  <DatePicker
                    className={classNames(`my-2 ${baseInputClassNames}`, { 'cursor-pointer': formNft.availabilityFrom !== 0 })}
                    selected={formNft.availabilityFrom !== 0 ? new Date(formNft.availabilityFrom * 1000) : undefined}
                    placeholderText='ANY'
                    onChange={(date) => {
                      const availabilityFrom = date
                        ? Math.floor(date.getTime() / 1000)
                        : 0;
                      setFormNft({
                        ...formNft,
                        availabilityFrom
                      })
                      setErrors({
                        ...errors,
                        date: validateDate(availabilityFrom, formNft.availabilityTo, formNft.duration)
                      })
                    }
                    }
                    disabled={formNft.availabilityFrom === 0}
                  />

                </div>
                <div className="relative">
                  <Label>End Of Availablility (optional)</Label>
                  <div
                    className={classNames("md:w-14 md:h-7 w-12 h-6 flex items-center rounded-full p-1 cursor-pointer", { "bg-gray-300": formNft.availabilityTo === 0 }, { "bg-indigo-500": formNft.availabilityTo !== 0 })}
                    onClick={() => {
                      const availabilityTo = formNft.availabilityTo === 0
                        ? Math.floor(
                          Date.now() / 1000 - ((Date.now() / 1000) % 300)
                        )
                        : 0;
                      setFormNft({
                        ...formNft,
                        availabilityTo
                      });
                      setErrors({
                        ...errors,
                        date: validateDate(formNft.availabilityFrom, availabilityTo, formNft.duration)
                      })
                    }}
                  >
                    <div
                      className={
                        classNames('bg-white md:w-6 md:h-6 h-5 w-5 rounded-full shadow-md transform', { 'transform translate-x-6': formNft.availabilityTo !== 0 })
                      }
                    />
                  </div>


                  <DatePicker
                    className={classNames(`my-2 ${baseInputClassNames}`, { 'cursor-pointer': formNft.availabilityTo !== 0 })}
                    selected={formNft.availabilityTo !== 0 ? new Date(formNft.availabilityTo * 1000) : undefined}
                    placeholderText='ANY'
                    onChange={(date) => {
                      const availabilityTo = date
                        ? Math.floor(date.getTime() / 1000)
                        : 0;
                      setFormNft({
                        ...formNft,
                        availabilityTo
                      })
                      setErrors({
                        ...errors,
                        date: validateDate(formNft.availabilityFrom, availabilityTo, formNft.duration)
                      })
                    }
                    }
                    disabled={formNft.availabilityTo === 0}
                  />
                  {errors.date && <span className="text-xs text-red-500">{errors.date}</span>}
                </div>
                <div>
                <div className="flex gap-3 mb-2 align-center">
                    <Label className="block text-sm font-medium text-gray-700">
                    Royalties (%)
                    </Label>
                    <Tooltip content="You share of secondary sales: every time your time is resold, you receive royalties on the sale"/>
                  </div>
                    <Input
                      type="number"
                      name="royalty"
                      id="royalty"
                      placeholder="Your share of secondary sales (%)"
                      value={formNft.royalty.toString()}
                      min={0}
                      max={100}
                      onChange={(e) => {
                        const royalty = Number(e.target.value)
                        setFormNft({ ...formNft, royalty })
                        setErrors({
                          ...errors,
                          royalty: validateRoyalty(royalty)
                        })
                      }
                      }
                      error={errors.royalty}
                    />
                </div>
              </div>
            )}
          </div>
        </div>
        {!currentAccount && <span className="absolute text-xs text-red-500 pt-1">No account connected</span>}
        <div className="sm:flex sm:flex-row-reverse pt-5">
          {!mintTxStatus.submitted && !mintTxStatus.confirmed && (
            <button
              type="button"
              className="disabled:opacity-50 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white sm:ml-3 sm:w-auto sm:text-sm"
              onClick={() => mintNft()}
              disabled={!currentAccount || !isValidForm(errors)}
            >
              Mint
            </button>
          )}
        </div>
        {mainTxError && <div className="text-red-500 text-center break-words">{mainTxError}</div>}
      </div>
    </Dialog>
  )
}
