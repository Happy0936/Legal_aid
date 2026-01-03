import { Input } from "@/components/ui/input";
import NetworkService from "@/NetworkService";
import { Search } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface IPCSection {
  id: number;
  section_number: string;
  description: string;
  punishment: string;
  offense:string
}

interface CommunityQuestion {
  id: number;
  title: string;
  content: string;
  created_at: string;
  likes: number;
  dislikes: number;
  user_id: string;
}

interface CommunityAnswer {
  id: number;
  content: string;
  created_at: string;
  likes: number;
  dislikes: number;
  user_id: string;
}

interface SearchResults {
  aisearch: string;
  ipcs: IPCSection[];
  questions: CommunityQuestion[];
  answers: CommunityAnswer[];
}

export function SearchPage() {
  const [perfectMatch, setPerfectMatch] = useState("");
  const [ipcResults, setIPCResults] = useState<IPCSection[]>([]);
  const [questionResults, setQuestionResults] = useState<CommunityQuestion[]>([]);
  const [answerResults, setAnswerResults] = useState<CommunityAnswer[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedItems, setExpandedItems] = useState<{ [key: string]: boolean }>({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const getSearchResults = () => {
    if (searchQuery.length < 3) {
      // Clear results if search query is too short
      setPerfectMatch("");
      setIPCResults([]);
      setQuestionResults([]);
      setAnswerResults([]);
      return;
    }

    setIsLoading(true);
    const network = new NetworkService();
    network.request(
      'ipc/search', 
      'POST', 
      { search: searchQuery }, 
      {}, 
      (error: any, responseData: SearchResults) => {
        setIsLoading(false);
        if (error) {
          console.error("Error fetching data:", error);
          return;
        }
        setPerfectMatch(responseData.aisearch);
        setIPCResults(responseData.ipcs);
        setQuestionResults(responseData.questions);
        setAnswerResults(responseData.answers);
      }
    );
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    
    // Automatically trigger search when 3 or more characters are typed
    if (value.length >= 3) {
      getSearchResults();
    } else {
      // Clear results if search query is too short
      setPerfectMatch("");
      setIPCResults([]);
      setQuestionResults([]);
      setAnswerResults([]);
    }
  };

  const truncateText = (text: string, maxLength: number = 200) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  const toggleExpand = (itemType: string, id: number) => {
    const key = id === 0 ? itemType : `${itemType}-${id}`;
    setExpandedItems(prev => ({ ...prev, [key]: !prev[key] }));
  };
  const handleQuestionClick = (id: number) => {
    navigate(`/question/${id}`);
  }
  return (
    <>
      <div className="flex w-full justify-center">
        <div className="flex justify-center mt-2 w-full">
          <div className='basis-1/2 flex justify-center align-center'>
            <Input 
              placeholder='Type at least 3 characters to search' 
              className='rounded-md' 
              value={searchQuery} 
              onChange={handleSearchChange}
            />
            <Search 
              size={36} 
              className={`cursor-pointer ${isLoading || searchQuery.length < 3 ? 'opacity-50' : ''}`}
              onClick={() => !isLoading && searchQuery.length >= 3 && getSearchResults()} 
            />
          </div>
        </div>
      </div>
      <div className="flex w-full flex-wrap gap-4 justify-center">
        {perfectMatch && (
          <div className="perfect p-3">
            {expandedItems['perfect-match'] ? perfectMatch : truncateText(perfectMatch)}
            {perfectMatch.length > 200 && (
              <button 
                className="text-blue-500 hover:text-blue-700 ml-2"
                onClick={() => toggleExpand('perfect-match', 0)}>
                {expandedItems['perfect-match'] ? 'Show Less' : 'View More'}
              </button>
            )}
          </div>
        )}

        {ipcResults.map((item: IPCSection) => (
          <Card key={item.id} className="w-full">
            <CardHeader>
              <CardTitle>{item.section_number}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex">
              <CardDescription className="basis-1/2">
                <h4 className="text-xl">Description</h4>
                {expandedItems[`ipc-desc-${item.id}`] ? item.description : truncateText(item.description)}
                {item.description.length > 200 && (
                  <button 
                    className="text-blue-500 hover:text-blue-700 ml-2"
                    onClick={() => toggleExpand('ipc-desc', item.id)}>
                    {expandedItems[`ipc-desc-${item.id}`] ? 'Show Less' : 'View More'}
                  </button>
                )}
                </CardDescription>

              <CardDescription className="basis-1/2">
                <h4 className="text-xl">Offence</h4>
                {expandedItems[`ipc-off-${item.id}`] ? item.offense : truncateText(item.offense)}
                {item.offense.length > 200 && (
                  <button 
                    className="text-blue-500 hover:text-blue-700 ml-2"
                    onClick={() => toggleExpand('ipc-off', item.id)}>
                    {expandedItems[`ipc-off-${item.id}`] ? 'Show Less' : 'View More'}
                  </button>
                )}
                </CardDescription>
              </div>
              <CardDescription>
                <h4 className="text-xl">Punishment</h4>
                {expandedItems[`ipc-pun-${item.id}`] ? item.punishment : truncateText(item.punishment)}
                {item.punishment.length > 200 && (
                  <button 
                    className="text-blue-500 hover:text-blue-700 ml-2"
                    onClick={() => toggleExpand('ipc-pun', item.id)}>
                    {expandedItems[`ipc-pun-${item.id}`] ? 'Show Less' : 'View More'}
                  </button>
                )}
                </CardDescription>
            </CardContent>
            <CardFooter>
             
            </CardFooter>
          </Card>
        ))}
        {questionResults.map((item: CommunityQuestion) => (
          <Card key={item.id} className="w-full">
            <CardHeader>
              <CardTitle>{item.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                {expandedItems[`question-${item.id}`] ? item.content : truncateText(item.content)}
                {item.content.length > 200 && (
                  <button 
                    className="text-blue-500 hover:text-blue-700 ml-2"
                    onClick={() => toggleExpand('question', item.id)}>
                    {expandedItems[`question-${item.id}`] ? 'Show Less' : 'View More'}
                  </button>
                )}
              </CardDescription>
              <CardDescription>Asked by: {item.user_id || "Anonymous User"}</CardDescription>
              <CardDescription>Asked on: {new Date(item.created_at).toLocaleString()}</CardDescription>
            </CardContent>
            <CardFooter>
              <button className="btn" onClick={()=>{handleQuestionClick(item.id) }}>View Answers</button>
            </CardFooter>
          </Card>
        ))}
        {answerResults.map((item: CommunityAnswer) => (
          <Card key={item.id} className="w-full">
            <CardHeader>
              <CardTitle>Answer</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                {expandedItems[`answer-${item.id}`] ? item.content : truncateText(item.content)}
                {item.content.length > 200 && (
                  <button 
                    className="text-blue-500 hover:text-blue-700 ml-2"
                    onClick={() => toggleExpand('answer', item.id)}>
                    {expandedItems[`answer-${item.id}`] ? 'Show Less' : 'View More'}
                  </button>
                )}
              </CardDescription>
              <CardDescription>Answered by: {item.user_id || "Anonymous User"}</CardDescription>
              <CardDescription>Answered on: {new Date(item.created_at).toLocaleString()}</CardDescription>
            </CardContent>
            <CardFooter>
        
            </CardFooter>
          </Card>
        ))}
      </div>
    </>
  )
}
