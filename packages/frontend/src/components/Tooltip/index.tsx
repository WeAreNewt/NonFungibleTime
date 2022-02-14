import { useState } from 'react';
import infoLogo from '../../images/info_logo.svg';

interface Props {
  content: string
}

const Tooltip : React.FC<Props> = ({ content }) => {

  const [open, setOpen] = useState(false);

  const openTooltip = () => setOpen(true);

  const closeTooltip = () => setOpen(false);

  return (
    <div className="relative flex justify-center items-center">
      <button
        onClick={openTooltip}
        onMouseEnter={openTooltip}
        onMouseLeave={closeTooltip}
      >
        <img className="w-4" src={infoLogo} alt="info" />
      </button>
      { open && <span className="absolute min-w-[200px] text-white p-3 bottom-7 text-sm bg-gray-800 rounded-lg">{content}</span> }
    </div>
  )
}

export default Tooltip;
