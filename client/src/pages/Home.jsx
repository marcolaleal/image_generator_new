import React, { useState, useEffect } from 'react';

import { Loader, Card, FormField } from '../components';


const RenderCards = ({ data, title }) => {
  if (data?.length > 0) {
    console.log(data);
    return (
      data.map((post) => <Card key={post._id} {...post} />)
    );
  }

  return (
    <h2 className="mt-5 font-bold text-[#6469ff] text-xl uppercase">{title}</h2>
  );
};


const Home = () => {
  const [loading, setLoading] = useState(false);
  const [allPosts, setAllPosts] = useState(null);

  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [searchTimeout, setSearchTimeout] = useState(null);
  

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);

      try {
        const response = await fetch('http://localhost:8080/api/v1/post', {
          method: 'GET',
          headers: {
            'Content-type': 'application/json', 
          },
        })

        if(response.ok) {
          const result = await response.json();
          console.log(result.data);

          setAllPosts(result.data.reverse());
        }
      } catch (error) {
        alert(error);
      } finally {
        setLoading(false);
      }
    }

    fetchPost();
  }, []);

  const handleSearchChange = (e) => {
    clearTimeout(searchTimeout);

    setSearchText(e.target.value);

    setSearchTimeout(
      setTimeout(() => {
        const searchResults = allPosts.filter((item) => item.name.toLowerCase().includes(searchText.toLowerCase()) ||
        item.prompt.toLowerCase().includes(searchText.toLowerCase()));
      
      
        setSearchResults(searchResults);
      }, 500)
    );

  }

  return (
    <section className="max-w-7x1 mx-auto">
      <div>
        <h1 className="font-extrabold text-[#222328] 
        text-[32px]">O que a comunidade está criando</h1>
      
        <p className="mt-2 text-[#666e75] text-[16px] 
        max-w-[500px]">Navegue por incríveis 
        coleções de imagens visualmente impressionantes 
        geradas por Inteligencia Artificial</p>
      </div>

      <div className="mt-16"> 
        <FormField
          labelName="Pesquisar Posts" 
          type="text"
          name="text"
          placeholder="Pesquisar Posts"
          value={searchText}
          handleChange={handleSearchChange}

        />
      </div>

      <div className="mt-10"> 
        {loading ? (
          <div className="flex justify-center items-center">
            <Loader />
          </div>
        ) : (
          <>
            {searchText && (
              <h2 className="font-medium text-[#666e75]" 
              text-xl mb-3>
                Apresentando resultados para <span className="text-
                [#222328]">{searchText}</span>
              </h2>
            )}
            <div className="grid lg:grid-cols-4 sm:grid-cols-3 
            xs:grid-cols-2 grid-cols-1 gap-3">
              {searchText ? (
                <RenderCards
                  data={searchResults}
                  title="Nenhum resultado encontrado"
                />
              ) : (
                <RenderCards
                  data={allPosts}
                  title="Nenhum post encontrado "
                />
              )}
            </div>
          </>
        )}
      </div>

    </section>
  )
}

export default Home