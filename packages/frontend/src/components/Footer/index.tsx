import twitterLogo from '../../images/twitter_logo.png';
import discordLogo from '../../images/discord_logo.png';
import etherscanLogo from '../../images/etherscan_logo.png';
import githubLogo from '../../images/github_logo.png';
import { useAppDataProvider } from '../../lib/providers/app-data-provider';

const texts : Record<string, string>[] = [
  { text: 'About', link: 'https://wearenewt.xyz/roadmap/non-fungible-time' },
  { text: 'Privacy Policy', link: 'https://ethlend.sharepoint.com/:w:/s/Projects/ESQrldNcNYVEqZmphDFqFsoBYkHswfX8dJDTknSahgfNjw?e=v8HgfJ' },
  { text: 'Terms & Conditions', link: 'https://ethlend.sharepoint.com/:w:/r/sites/Projects/_layouts/15/Doc.aspx?sourcedoc=%7B1108E258-0D31-46D4-8CBE-4CA9F4EEAC96%7D&file=Terms%20and%20Conditions%20Non-fungible%20time%20%5Brr%20comments%20incorporated%20from%2001.02.2022%5D.docx&nav=eyJjIjoyMTI2ODQ5MzI5fQ&action=default&mobileredirect=true&cid=28ccc981-d2d0-4cce-993e-5c831b8dd38b' },
  { text: 'Report bugs', link: 'https://discord.com/channels/909763209056112651/922568003311243324' },
  { text: 'Request features', link: 'https://discord.com/channels/909763209056112651/913088754418348072' }
]

export default function Footer() : JSX.Element {
  const { networkConfig } = useAppDataProvider();
  const icons : Record<string, string>[] = [
    { url: discordLogo, link: 'https://discord.gg/newt', alt: 'discord' },
    { url: twitterLogo, link: 'https://twitter.com/wearenewt', alt: 'twitter' },
    { url: githubLogo, link: 'https://github.com/wearenewt/NonFungibleTime', alt: 'github' },
    { url: etherscanLogo, link: networkConfig.blockExplorer + '/address/' + networkConfig.collectionAddress, alt: 'etherscan' }
  ]

  return( 
    <footer className="px-14 py-14 bg-gray-800 flex flex-col md:flex-row">
        <div className="flex flex-col items-center gap-4 md:flex-row">
          {texts.map(text => <a className="text-white" target="/blank" key={text.text} href={text.link} > {text.text} </a> )}
        </div>
        <div className="mt-6 flex justify-center gap-4 flex-shrink-0 md:ml-auto md:mt-0">
          {icons.map(icon => <a href={icon.link} target="/blank" key={icon.alt}><img src={icon.url} alt={icon.alt} ></img></a> )}
        </div>
    </footer>
  );
};
