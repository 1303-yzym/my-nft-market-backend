import {ethers,JsonRpcProvider} from "ethers";
import fs from "fs";
//0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512
export async function mint (to, uri) {
    const provider = new JsonRpcProvider("http://localhost:8545");
    const signer =await provider.getSigner();
    const abi = JSON.parse(fs.readFileSync('./abis/MyNFT.json'));
    const contractAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
    const contract = new ethers.Contract(contractAddress, abi, signer);
    const result = await contract.safeMint(to,uri);
    console.log(result.hash);
}
