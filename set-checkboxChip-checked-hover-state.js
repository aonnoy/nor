// Select all checkboxes with the class '.checkbox-chip_checkbox'
const checkboxes = document.querySelectorAll('.checkbox-chip input[type="checkbox"]');

checkboxes.forEach((checkbox) => {
    // Add an event listener for changes to each checkbox
    checkbox.addEventListener('change', function () {
        // Find the parent element with the class 'checkbox-chip' to scope the changes
        const checkboxChip = this.closest('.checkbox-chip');
        const checkboxLabel = checkboxChip.querySelector('.checkbox-chip_label');
        const iconNotChecked = checkboxChip.querySelector('.checkbox-chip_icon.not-checked');
        const iconChecked = checkboxChip.querySelector('.checkbox-chip_icon.checked');

        if (this.checked) {
            // Add the combo class to the checkbox chip and label
            checkboxChip.classList.add('checked');
            checkboxLabel.classList.add('checked');

            // Add the custom attribute to the not-checked icon
            iconNotChecked.setAttribute('custom-cloak', '');

            // Remove the custom attribute from the checked icon
            iconChecked.removeAttribute('custom-cloak');
        } else {
            // Remove the combo class from the checkbox chip and label
            checkboxChip.classList.remove('checked');
            checkboxLabel.classList.remove('checked');

            // Remove the custom attribute from the not-checked icon
            iconNotChecked.removeAttribute('custom-cloak');

            // Add the custom attribute to the checked icon
            iconChecked.setAttribute('custom-cloak', '');
        }
    });

    // Add hover effect
    const checkboxChip = checkbox.closest('.checkbox-chip');
    const checkboxLabel = checkboxChip.querySelector('.checkbox-chip_label');

    // Add hover event listeners
    checkboxChip.addEventListener('mouseenter', function () {
        if (!checkbox.checked) {
            checkboxChip.classList.add('checked');
            checkboxLabel.classList.add('checked');
        }
    });

    checkboxChip.addEventListener('mouseleave', function () {
        if (!checkbox.checked) {
            checkboxChip.classList.remove('checked');
            checkboxLabel.classList.remove('checked');
        }
    });
});
