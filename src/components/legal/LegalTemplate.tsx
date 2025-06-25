export interface LegalSection{
    title:string;
    p:string;
    liElements?:string[];
}

interface Props{
    title:string;
    sections: LegalSection[]    
}

export default function LegalTemplate({title, sections}: Props){
    return <>
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-12">
    <h1 className="text-3xl font-bold mb-1 text-gray-800">{title}</h1>
    
    <p className="mb-6 md:mb-10 ml-1 text-sm font-light border-b py-2 border-b-gray-300">Last updated: {new Date().toLocaleDateString()}</p>    

    {sections.map(({title,p, liElements}, index)=>(
        <div key={index}>
            <h2 className="mb-2">{index+1}. {title}</h2>
            <p className="ml-4">{p}</p>
            {liElements && liElements.length >=1 ? <ul className="list-disc list-inside ml-6 text-gray-700">
                {liElements.map((liString, idx)=>(
                    <li key={idx} className="mb-1 last:mb-5">{liString}</li>    
                ))}      
            </ul>
            :<div className="mb-5"></div>
            }
        </div>
    ))}
    
    
  </main>
  </>
}