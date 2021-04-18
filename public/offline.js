const makeIndexDB = () => {

  if (!('indexedDB' in window)) {
    console.log('IndexedDB not supported');
    return;
  }

  const request = window.indexedDB.open('offlineBudget', 1);
  request.onupgradeneeded = ({ target }) => {
    let db = target.result;
    const objectStore = db.createObjectStore('offlineBudget', {
      keyPath: 'budgetId',
      autoIncrement: true,
    });
    console.log('creating index');
    objectStore.createIndex('budgetIndex', 'budget');
  };

  request.onsuccess = () => {
    const db = request.result;

    if (navigator.onLine) {
      const transaction = db.transaction(['offlineBudget'], 'readwrite');
      const budgetStore = transaction.objectStore('offlineBudget');

      // Return all items
      const getRequestAll = budgetStore.getAll();
      getRequestAll.onsuccess = () => {
        console.log(getRequestAll.result);
        console.log('add all files to DB');
      };
    }
  };

  request.onerror = function () {
    console.log('There was an error');
  };
};
makeIndexDB();
