export interface Quiz{
    title: string;
    questions:Question[];
    
}

interface Question{
    formula:string;
    answer: number;
    timespent:number;
}


