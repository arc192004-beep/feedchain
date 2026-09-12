<script>
    (function () {
        const container = document.getElementById('formula-items');
        const template = document.getElementById('formula-item-template');
        const addButton = document.getElementById('add-item-row');

        function reindexRows() {
            container.querySelectorAll('.formula-item-row').forEach((row, index) => {
                row.querySelectorAll('[name]').forEach((input) => {
                    const field = input.getAttribute('data-name') || input.name.match(/\[(\w+)\]$/)?.[1];
                    if (field) {
                        input.name = `items[${index}][${field}]`;
                    }
                });
            });
        }

        addButton.addEventListener('click', () => {
            const clone = template.content.cloneNode(true);
            container.appendChild(clone);
            reindexRows();
        });

        container.addEventListener('click', (event) => {
            if (event.target.classList.contains('remove-item-row')) {
                const rows = container.querySelectorAll('.formula-item-row');
                if (rows.length <= 1) {
                    return;
                }
                event.target.closest('.formula-item-row').remove();
                reindexRows();
            }
        });
    })();
</script>
