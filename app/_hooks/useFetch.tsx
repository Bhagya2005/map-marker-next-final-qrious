import { useEffect, useState } from "react";

type UseFetchResult<T> = {
  data: T | null;
  loading: boolean;
  error: string | null;
};

function useFetch<T>(url: string): UseFetchResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error("Failed to fetch");

        const result: T = await res.json();
        setData(result);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  return { data, loading, error };
}

export default useFetch;

//1. first humko T se datatype define karna hota hai 
//2.fir jo data iss file se lene wale hai ushka data type likhna 
//3. jo hooks use huye vo mention karna with datatype
//4.async await me catch me error me type assersion ka use karna so that method provide ho jishme .message ho 
//5. jaha bhi call kare waha datatype define kar dena and call karna like this 
// const {data,loading,error} = useFetch<User[]>(
//        "https://..."
//  );