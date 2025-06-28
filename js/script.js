document.addEventListener('DOMContentLoaded', () => {
    // Definição das listas de leitura (sem alterações)
    const lists = [
        { title: "Lista 1: Evangelhos", books: [{name: "Mateus", chapters: 28}, {name: "Marcos", chapters: 16}, {name: "Lucas", chapters: 24}, {name: "João", chapters: 21}] },
        { title: "Lista 2: Pentateuco", books: [{name: "Gênesis", chapters: 50}, {name: "Êxodo", chapters: 40}, {name: "Levítico", chapters: 27}, {name: "Números", chapters: 36}, {name: "Deuteronômio", chapters: 34}] },
        { title: "Lista 3: Epístolas Paulinas", books: [{name: "Romanos", chapters: 16}, {name: "1 Coríntios", chapters: 16}, {name: "2 Coríntios", chapters: 13}, {name: "Gálatas", chapters: 6}, {name: "Efésios", chapters: 6}, {name: "Filipenses", chapters: 4}, {name: "Colossenses", chapters: 4}, {name: "Hebreus", chapters: 13}] },
        { title: "Lista 4: Epístolas Gerais", books: [{name: "1 Tessalonicenses", chapters: 5}, {name: "2 Tessalonicenses", chapters: 3}, {name: "1 Timóteo", chapters: 6}, {name: "2 Timóteo", chapters: 4}, {name: "Tito", chapters: 3}, {name: "Filemom", chapters: 1}, {name: "Tiago", chapters: 5}, {name: "1 Pedro", chapters: 5}, {name: "2 Pedro", chapters: 3}, {name: "1 João", chapters: 5}, {name: "2 João", chapters: 1}, {name: "3 João", chapters: 1}, {name: "Judas", chapters: 1}, {name: "Apocalipse", chapters: 22}] },
        { title: "Lista 5: Sabedoria", books: [{name: "Jó", chapters: 42}, {name: "Eclesiastes", chapters: 12}, {name: "Cantares", chapters: 8}] },
        { title: "Lista 6: Salmos", books: [{name: "Salmos", chapters: 150}] },
        { title: "Lista 7: Provérbios", books: [{name: "Provérbios", chapters: 31}] },
        { title: "Lista 8: Históricos (AT)", books: [{name: "Josué", chapters: 24}, {name: "Juízes", chapters: 21}, {name: "Rute", chapters: 4}, {name: "1 Samuel", chapters: 31}, {name: "2 Samuel", chapters: 24}, {name: "1 Reis", chapters: 22}, {name: "2 Reis", chapters: 25}, {name: "1 Crônicas", chapters: 29}, {name: "2 Crônicas", chapters: 36}, {name: "Esdras", chapters: 10}, {name: "Neemias", chapters: 13}, {name: "Ester", chapters: 10}] },
        { title: "Lista 9: Profetas (AT)", books: [{name: "Isaías", chapters: 66}, {name: "Jeremias", chapters: 52}, {name: "Lamentações", chapters: 5}, {name: "Ezequiel", chapters: 48}, {name: "Daniel", chapters: 12}, {name: "Oseias", chapters: 14}, {name: "Joel", chapters: 3}, {name: "Amós", chapters: 9}, {name: "Obadias", chapters: 1}, {name: "Jonas", chapters: 4}, {name: "Miqueias", chapters: 7}, {name: "Naum", chapters: 3}, {name: "Habacuque", chapters: 3}, {name: "Sofonias", chapters: 3}, {name: "Ageu", chapters: 2}, {name: "Zacarias", chapters: 14}, {name: "Malaquias", chapters: 4}] },
        { title: "Lista 10: Histórico (NT)", books: [{name: "Atos", chapters: 28}] }
    ];

    const container = document.getElementById('reading-lists');
    let progress = JSON.parse(localStorage.getItem('readingProgress')) || {};

    function initializeProgress() {
        if (Object.keys(progress).length === 0) {
            lists.forEach((_, listIndex) => {
                progress[listIndex] = { bookIndex: 0, chapterIndex: 0 };
            });
            saveProgress();
        }
    }

    function saveProgress() {
        localStorage.setItem('readingProgress', JSON.stringify(progress));
    }

    function renderLists() {
        container.innerHTML = '';
        lists.forEach((list, listIndex) => {
            const currentBookIndex = progress[listIndex].bookIndex;
            const currentBook = list.books[currentBookIndex];

            const totalChaptersInList = list.books.reduce((sum, book) => sum + book.chapters, 0);
            let chaptersRead = 0;
            for (let i = 0; i < currentBookIndex; i++) {
                chaptersRead += list.books[i].chapters;
            }
            chaptersRead += progress[listIndex].chapterIndex;
            const percentage = totalChaptersInList > 0 ? (chaptersRead / totalChaptersInList) * 100 : 0;

            const card = document.createElement('div');
            card.className = 'list-card bg-white rounded-lg shadow-lg p-6';
           
            let chaptersHTML = '';
            for(let i = 1; i <= currentBook.chapters; i++) {
                let btnClass = 'chapter-btn border border-slate-300 rounded-md py-1 px-2 text-sm';
                if (i <= progress[listIndex].chapterIndex) {
                    btnClass += ' read';
                } else if (i === progress[listIndex].chapterIndex + 1) {
                    btnClass += ' next-up';
                }
                chaptersHTML += `<button class="${btnClass}" data-list="${listIndex}" data-chapter="${i}">${i}</button>`;
            }
           
            card.innerHTML = `
                <h2 class="text-xl font-bold mb-2">${list.title}</h2>
                <h3 class="text-lg font-medium text-slate-600 mb-2">${currentBook.name}</h3>
                <p class="text-sm text-slate-500 mb-4">Progresso na lista: ${chaptersRead} de ${totalChaptersInList} capítulos</p>
                <div class="w-full bg-slate-200 rounded-full h-2.5 mb-4">
                    <div class="progress-bar-fill bg-green-500 h-2.5 rounded-full" style="width: ${percentage}%"></div>
                </div>
                <div class="flex flex-wrap gap-2">
                    ${chaptersHTML}
                </div>
                <button class="reset-list-btn mt-4 bg-red-500 text-white font-bold py-1 px-4 rounded-md shadow-sm hover:bg-red-600 transition text-sm" data-list="${listIndex}">
                    Zerar Esta Lista
                </button>
            `;
            container.appendChild(card);
        });

        addEventListeners();
    }

    function addEventListeners() {
        document.querySelectorAll('.chapter-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const listIndex = parseInt(e.target.dataset.list, 10);
                const chapter = parseInt(e.target.dataset.chapter, 10);
                const listProgress = progress[listIndex];
                const list = lists[listIndex];
                const currentBook = list.books[listProgress.bookIndex];
               
                if (chapter === listProgress.chapterIndex + 1) {
                    listProgress.chapterIndex = chapter;
                } else if(chapter <= listProgress.chapterIndex) {
                    listProgress.chapterIndex = chapter - 1;
                }

                if (listProgress.chapterIndex >= currentBook.chapters) {
                    listProgress.bookIndex++;
                    listProgress.chapterIndex = 0;
                    if (listProgress.bookIndex >= list.books.length) {
                        listProgress.bookIndex = 0;
                    }
                }
               
                saveProgress();
                renderLists();
            });
        });

        // CORREÇÃO: Adiciona event listeners para os botões de zerar lista individual
        // O seletor agora está correto, usando '.' para indicar a classe.
        document.querySelectorAll('.reset-list-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const listIndex = parseInt(e.target.dataset.list, 10);
                if (confirm(`Tem certeza que deseja zerar o progresso da ${lists[listIndex].title}? Esta ação não pode ser desfeita.`)) {
                    // Reinicia o progresso apenas para a lista clicada
                    progress[listIndex] = { bookIndex: 0, chapterIndex: 0 };
                    saveProgress();
                    renderLists();
                }
            });
        });
    }
            
    document.getElementById('reset-progress').addEventListener('click', () => {
        if (confirm('Tem certeza que deseja zerar todo o seu progresso de leitura? Esta ação não pode ser desfeita.')) {
            progress = {};
            initializeProgress();
            renderLists();
        }
    });

    initializeProgress();
    renderLists();
});