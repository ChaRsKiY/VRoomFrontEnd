// import algoliasearch from 'algoliasearch/lite';

// // @ts-ignore
// const searchClient = algoliasearch('0WCG0BLDYL', 'b6e23c5553961b286e06a88b75a8821a');

// const index = searchClient.initIndex('videos');

// export const searchVideos = async  (query: string): Promise<any[]> => {
//   const results = await index.search(query);
//   return results.hits;
// };

 import algoliasearch from 'algoliasearch';

const searchClient = algoliasearch('0WCG0BLDYL', 'b6e23c5553961b286e06a88b75a8821a');

const index = searchClient.initIndex('videos');

index.setSettings({
  indexLanguages: ['en','ru','de'], 
  queryLanguages: ['en','ru','de'], 
}).then((content) => {
  console.log('Настройки индекса успешно применены:', content);
}).catch((err) => {
  console.error('Ошибка применения настроек индекса:', err);
});

export const searchVideos = async (query: string): Promise<any[]> => {
  try {

    const results = await index.search(query);
    return results.hits;
  } catch (err) {
    console.error('Ошибка поиска:', err);
    return [];
  }
};
