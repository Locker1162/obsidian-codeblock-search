import { Plugin, Modal, App, ItemView, WorkspaceLeaf } from 'obsidian';

class CodeBlockSearchModal extends Modal {
    private inputEl: HTMLInputElement;

    constructor(app: App, private onSearch: (term: string) => void) {
        super(app);
    }

    onOpen() {
        let { contentEl } = this;
        contentEl.createEl('h2', { text: 'Search Code Blocks' });
        this.inputEl = contentEl.createEl('input', {
            type: 'text',
            placeholder: 'Enter search term...'
        });
        this.inputEl.addEventListener('keydown', (e: KeyboardEvent) => {
            if (e.key === 'Enter' && this.inputEl.value.trim()) {
                e.preventDefault();
                this.onSearch(this.inputEl.value.trim());
                this.close();
            }
        });
        this.inputEl.focus();
    }

    onClose() {
        let { contentEl } = this;
        contentEl.empty();
    }
}

class CodeBlockSearchView extends ItemView {
    constructor(leaf: WorkspaceLeaf) {
        super(leaf);
    }

    getViewType() {
        return 'codeblock-search-view';
    }

    getDisplayText() {
        return 'Code Block Search Results';
    }

    async onOpen() {
        this.contentEl.createEl('h1', { text: 'Search Results' });
    }

    async onClose() {
        this.contentEl.empty();
    }
}

export default class CodeBlockSearchPlugin extends Plugin {
    onload() {
        this.registerView('codeblock-search-view', (leaf: WorkspaceLeaf) => new CodeBlockSearchView(leaf));

        this.addCommand({
            id: 'open-codeblock-search',
            name: 'Search in Code Blocks',
            callback: () => {
                new CodeBlockSearchModal(this.app, this.handleSearch.bind(this)).open();
            }
        });
    }

    handleSearch(term: string) {
        let leaf = this.app.workspace.getLeaf(true);
        leaf.setViewState({
            type: 'codeblock-search-view',
            state: {}
        }).then(() => {
            if (leaf.view instanceof CodeBlockSearchView) {
                this.performSearch(term, leaf.view);
            }
        });
    }

    performSearch(term: string, view: CodeBlockSearchView) {
        const escapedTerm = term.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
        const codeBlockRegex = /```(?:[^`]|`[^`]|``[^`])*```/gs; // Improved regex
    
        view.contentEl.empty(); // Clear previous results
    
        let searches = this.app.vault.getMarkdownFiles().map(async file => {
            const fileContent = await this.app.vault.read(file);
            let foundInFile = false; // Flag to track if matches are found in the current file
    
            const codeBlocks = fileContent.match(codeBlockRegex);
    
            if (codeBlocks) {
                codeBlocks.forEach(block => {
                    // Verify if block contains the escaped term
                    if (new RegExp(escapedTerm, 'i').test(block)) {
                        const codeBlock = document.createElement('pre');
                        codeBlock.className = 'code-block';
                        const codeContent = document.createElement('code');
                        codeContent.textContent = block.slice(3, -3); // Remove the triple backticks
    
                        const copyBtn = document.createElement('button');
                        copyBtn.textContent = 'Copy';
                        copyBtn.onclick = () => {
                            navigator.clipboard.writeText(codeContent.textContent || '');
                        };
    
                        codeBlock.appendChild(codeContent);
                        codeBlock.appendChild(copyBtn);
                        view.contentEl.appendChild(codeBlock);
                        foundInFile = true; // Update the found flag for the current file
                    }
                });
            }
    
            return foundInFile; // Return whether any matches were found in this file
        });
    
        Promise.all(searches).then(results => {
            // Check if there were any matches in any of the files
            const noMatchesAnywhere = results.every(found => !found); // True if no files returned true
            if (noMatchesAnywhere) {
                const noResults = document.createElement('div');
                noResults.textContent = 'No results found.';
                view.contentEl.appendChild(noResults);
            }
        });
    }
        
}
