import Header from "@/components/partials/Header";
import Link from "next/link";


export default function Scores() {
    const scores = [{"name": "Hanan", "score": 23}, {"name": "Hanan", "score": 23}, {"name": "Hanan", "score": 23}];

    return (
        <div className="flex flex-col flex-grow">
            <Link href="/">
                <div className="w-3/4 flex text-white mt-4 pl-5">
                <div className="w-3/4">
                    <img src="/assets/svg/logo.svg" />
                </div>
                <div className="flex-grow w-1/4 flex flex-col justify-end">
                    <div className="font-bold text-gray-100">SET GAME</div>
                </div>
                </div>
            </Link>
            <div className="flex flex-col flex-grow bg-gray-100 m-10 rounded-xl pt-3">
                <table>
                    <thead>
                        <tr>
                            <th className="py-3">
                                Name    
                            </th>
                            <th className="py-3">
                                Score    
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {scores.map((score, idx) => (
                            <tr key={idx} className={(idx % 2 == 0? "bg-gray-100": "bg-gray-200") + " border-t border-t-gray-300"}>
                                <td className="text-center py-3">{score.name}</td>
                                <td className="text-center py-3">{score.score}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}