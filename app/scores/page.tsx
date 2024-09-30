import Header from "@/components/partials/Header";


export default function Scores() {
    const scores = [{"name": "Hanan", "score": 23}, {"name": "Hanan", "score": 23}, {"name": "Hanan", "score": 23}];

    return (
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
                        <tr key={idx} className={(idx % 2 == 0? "": "bg-gray-400") + "border-t-gray-400 border-t-2"}>
                            <td className="text-center py-3">{score.name}</td>
                            <td className="text-center py-3">{score.score}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}