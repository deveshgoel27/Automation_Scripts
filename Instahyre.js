const viewButton = document.querySelector('#interested-btn');
if (viewButton) {
  viewButton.click();
  console.log('%c🚀 Opened modal by clicking View button', 'color: green; font-weight: bold;');
} else {
  console.log('%c⚠️ View button not found — maybe modal is already open.', 'color: orange; font-weight: bold;');
}

let applyCount = 0;
let intervalId = null;

// Step 2: Run the apply logic every 3 seconds
intervalId = setInterval(() => {
  const bulkApplyButton = document.querySelector('button.btn-success[ng-click="applyBulk()"]');
  const normalApplyButton = document.querySelector('.apply[ng-click*="submitChoice"] .new-btn');

  if (bulkApplyButton && !bulkApplyButton.disabled) {
    bulkApplyButton.click();
    applyCount++;
    console.log(`%c✅ [${applyCount}] Bulk Apply clicked at ${new Date().toLocaleTimeString()}`, 'color: blue');
    return;
  }

  if (normalApplyButton) {
    normalApplyButton.click();
    applyCount++;
    console.log(`%c✅ [${applyCount}] Normal Apply clicked at ${new Date().toLocaleTimeString()}`, 'color: teal');
    return;
  }

  // If no apply buttons found — STOP
  console.log('%c🎉 All jobs applied successfully!', 'color: limegreen; font-size: 16px; font-weight: bold;');
  console.log(`%c🧾 Total Jobs Applied: ${applyCount}`, 'color: #2196F3; font-weight: bold;');
  clearInterval(intervalId);
}, 3000);
