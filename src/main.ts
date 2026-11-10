/**
 * Sarab Restaurant & Fast Food
 * Client-side Form Handling & Validation Logic (TypeScript)
 */

// ==========================================
// 1. STRICT TYPE INTERFACES
// ==========================================

/**
 * Standard backend JSON response structure from save_reservation.php and save_contact.php
 */
interface ApiResponse {
    status: 'success' | 'error';
    message: string;
}

/**
 * Strongly-typed DOM element bindings for Reservation Form
 */
interface ReservationFormElements {
    form: HTMLFormElement | null;
    nameInput: HTMLInputElement | null;
    phoneInput: HTMLInputElement | null;
    emailInput: HTMLInputElement | null;
    guestsInput: HTMLSelectElement | null;
    dateInput: HTMLInputElement | null;
    timeInput: HTMLSelectElement | null;
    specialInput: HTMLTextAreaElement | null;
    submitBtn: HTMLButtonElement | null;
    successBox: HTMLElement | null;
    nameError: HTMLElement | null;
    phoneError: HTMLElement | null;
    emailError: HTMLElement | null;
    guestsError: HTMLElement | null;
    dateError: HTMLElement | null;
    timeError: HTMLElement | null;
}

/**
 * Strongly-typed DOM element bindings for Contact Form
 */
interface ContactFormElements {
    form: HTMLFormElement | null;
    nameInput: HTMLInputElement | null;
    emailInput: HTMLInputElement | null;
    phoneInput: HTMLInputElement | null;
    subjectInput: HTMLSelectElement | null;
    messageInput: HTMLTextAreaElement | null;
    submitBtn: HTMLButtonElement | null;
    successBox: HTMLElement | null;
    nameError: HTMLElement | null;
    emailError: HTMLElement | null;
    phoneError: HTMLElement | null;
    subjectError: HTMLElement | null;
    messageError: HTMLElement | null;
}

// ==========================================
// 2. DOM QUERY HELPERS
// ==========================================

function getReservationElements(): ReservationFormElements {
    return {
        form: document.getElementById('reservation-form') as HTMLFormElement | null,
        nameInput: document.getElementById('res-name') as HTMLInputElement | null,
        phoneInput: document.getElementById('res-phone') as HTMLInputElement | null,
        emailInput: document.getElementById('res-email') as HTMLInputElement | null,
        guestsInput: document.getElementById('res-guests') as HTMLSelectElement | null,
        dateInput: document.getElementById('res-date') as HTMLInputElement | null,
        timeInput: document.getElementById('res-time') as HTMLSelectElement | null,
        specialInput: document.getElementById('res-special') as HTMLTextAreaElement | null,
        submitBtn: document.getElementById('res-submit-btn') as HTMLButtonElement | null,
        successBox: document.getElementById('reservation-success'),
        nameError: document.getElementById('res-name-error'),
        phoneError: document.getElementById('res-phone-error'),
        emailError: document.getElementById('res-email-error'),
        guestsError: document.getElementById('res-guests-error'),
        dateError: document.getElementById('res-date-error'),
        timeError: document.getElementById('res-time-error')
    };
}

function getContactElements(): ContactFormElements {
    return {
        form: document.getElementById('contact-form') as HTMLFormElement | null,
        nameInput: document.getElementById('contact-name') as HTMLInputElement | null,
        emailInput: document.getElementById('contact-email') as HTMLInputElement | null,
        phoneInput: document.getElementById('contact-phone') as HTMLInputElement | null,
        subjectInput: document.getElementById('contact-subject') as HTMLSelectElement | null,
        messageInput: document.getElementById('contact-message') as HTMLTextAreaElement | null,
        submitBtn: document.getElementById('contact-submit-btn') as HTMLButtonElement | null,
        successBox: document.getElementById('contact-success'),
        nameError: document.getElementById('contact-name-error'),
        emailError: document.getElementById('contact-email-error'),
        phoneError: document.getElementById('contact-phone-error'),
        subjectError: document.getElementById('contact-subject-error'),
        messageError: document.getElementById('contact-message-error')
    };
}

// ==========================================
// 3. VALIDATION & UI HELPERS
// ==========================================

function showFieldError(
    inputEl: HTMLElement | null,
    errorEl: HTMLElement | null,
    message: string
): void {
    if (errorEl) {
        errorEl.textContent = message;
        errorEl.classList.remove('hidden');
    }
    if (inputEl) {
        inputEl.classList.add('border-red-500', 'focus:ring-red-200', 'focus:border-red-500');
        inputEl.classList.remove('border-gray-200', 'focus:ring-brand-red/20', 'focus:border-brand-red');
    }
}

function clearFieldError(
    inputEl: HTMLElement | null,
    errorEl: HTMLElement | null
): void {
    if (errorEl) {
        errorEl.classList.add('hidden');
        errorEl.textContent = '';
    }
    if (inputEl) {
        inputEl.classList.remove('border-red-500', 'focus:ring-red-200', 'focus:border-red-500');
        inputEl.classList.add('border-gray-200', 'focus:ring-brand-red/20', 'focus:border-brand-red');
    }
}

function isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

function isValidPhone(phone: string): boolean {
    const trimmed = phone.trim();
    const digits = trimmed.replace(/[^\d]/g, '');
    // Accept standard 10-digit Sri Lankan local numbers (e.g. 0771234567)
    // as well as international +94 format (e.g. +94771234567)
    return digits.length === 10 || (trimmed.startsWith('+94') && digits.length === 11);
}

/**
 * Formats the user's local calendar date as YYYY-MM-DD (avoids UTC midnight offset bugs)
 */
function getLocalTodayDate(): string {
    const now = new Date();
    const pad2 = (n: number): string => (n < 10 ? `0${n}` : `${n}`);
    const year = now.getFullYear();
    const month = pad2(now.getMonth() + 1);
    const day = pad2(now.getDate());
    return `${year}-${month}-${day}`;
}

/**
 * Safely parses JSON response from PHP endpoints without crashing on HTML error pages
 */
async function parseApiResponse(response: Response): Promise<ApiResponse> {
    const rawText = await response.text();
    try {
        const parsed = JSON.parse(rawText) as Partial<ApiResponse>;
        if (parsed && (parsed.status === 'success' || parsed.status === 'error') && typeof parsed.message === 'string') {
            return { status: parsed.status, message: parsed.message };
        }
    } catch {
        // Non-JSON response fell through below
    }

    return {
        status: 'error',
        message: response.ok
            ? 'Unexpected response format from server.'
            : `Server returned HTTP ${response.status}. Make sure PHP and MySQL are configured properly.`
    };
}

/**
 * Initializes reservation min-date and binds live input/change error clearing
 */
function initFormControls(): void {
    const res = getReservationElements();
    if (res.dateInput) {
        res.dateInput.min = getLocalTodayDate();
    }

    const reservationFieldPairs: Array<[HTMLElement | null, HTMLElement | null, 'input' | 'change']> = [
        [res.nameInput, res.nameError, 'input'],
        [res.phoneInput, res.phoneError, 'input'],
        [res.emailInput, res.emailError, 'input'],
        [res.guestsInput, res.guestsError, 'change'],
        [res.dateInput, res.dateError, 'change'],
        [res.timeInput, res.timeError, 'change']
    ];

    reservationFieldPairs.forEach(([inputEl, errorEl, eventName]) => {
        inputEl?.addEventListener(eventName, () => clearFieldError(inputEl, errorEl));
    });

    const contact = getContactElements();
    const contactFieldPairs: Array<[HTMLElement | null, HTMLElement | null, 'input' | 'change']> = [
        [contact.nameInput, contact.nameError, 'input'],
        [contact.emailInput, contact.emailError, 'input'],
        [contact.phoneInput, contact.phoneError, 'input'],
        [contact.subjectInput, contact.subjectError, 'change'],
        [contact.messageInput, contact.messageError, 'input']
    ];

    contactFieldPairs.forEach(([inputEl, errorEl, eventName]) => {
        inputEl?.addEventListener(eventName, () => clearFieldError(inputEl, errorEl));
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFormControls);
} else {
    initFormControls();
}

// ==========================================
// 4. RESERVATION FORM HANDLER
// ==========================================

async function handleReservation(e: Event): Promise<boolean> {
    e.preventDefault();
    e.stopPropagation();

    const elements = getReservationElements();
    const {
        form,
        nameInput,
        phoneInput,
        emailInput,
        guestsInput,
        dateInput,
        timeInput,
        submitBtn,
        successBox,
        nameError,
        phoneError,
        emailError,
        guestsError,
        dateError,
        timeError
    } = elements;

    if (submitBtn?.disabled) {
        return false;
    }

    let isValid = true;
    let firstError: HTMLElement | null = null;

    // 1. Validate Full Name
    if (!nameInput || !nameInput.value.trim()) {
        showFieldError(nameInput, nameError, 'Name is required');
        isValid = false;
        if (!firstError) firstError = nameInput;
    } else {
        clearFieldError(nameInput, nameError);
    }

    // 2. Validate Phone Number
    if (!phoneInput || !phoneInput.value.trim()) {
        showFieldError(phoneInput, phoneError, 'Phone number is required');
        isValid = false;
        if (!firstError) firstError = phoneInput;
    } else if (!isValidPhone(phoneInput.value)) {
        showFieldError(phoneInput, phoneError, 'Please enter a valid 10-digit number');
        isValid = false;
        if (!firstError) firstError = phoneInput;
    } else {
        clearFieldError(phoneInput, phoneError);
    }

    // 3. Validate Email Address
    if (!emailInput || !emailInput.value.trim()) {
        showFieldError(emailInput, emailError, 'Email is required');
        isValid = false;
        if (!firstError) firstError = emailInput;
    } else if (!isValidEmail(emailInput.value)) {
        showFieldError(emailInput, emailError, 'Please enter a valid email');
        isValid = false;
        if (!firstError) firstError = emailInput;
    } else {
        clearFieldError(emailInput, emailError);
    }

    // 4. Validate Number of Guests
    if (!guestsInput || !guestsInput.value) {
        showFieldError(guestsInput, guestsError, 'Number of guests is required');
        isValid = false;
        if (!firstError) firstError = guestsInput;
    } else {
        clearFieldError(guestsInput, guestsError);
    }

    // 5. Validate Reservation Date
    const todayStr = getLocalTodayDate();
    if (!dateInput || !dateInput.value) {
        showFieldError(dateInput, dateError, 'Date is required');
        isValid = false;
        if (!firstError) firstError = dateInput;
    } else if (dateInput.value < todayStr) {
        showFieldError(dateInput, dateError, 'Please select today or a future date');
        isValid = false;
        if (!firstError) firstError = dateInput;
    } else {
        clearFieldError(dateInput, dateError);
    }

    // 6. Validate Reservation Time
    if (!timeInput || !timeInput.value) {
        showFieldError(timeInput, timeError, 'Time is required');
        isValid = false;
        if (!firstError) firstError = timeInput;
    } else {
        clearFieldError(timeInput, timeError);
    }

    // If invalid, focus first invalid field and stop
    if (!isValid) {
        firstError?.focus();
        return false;
    }

    if (!form || !submitBtn) {
        console.error('Reservation form or submit button element is missing.');
        return false;
    }

    if (window.location.protocol === 'file:') {
        alert('Please open this page through XAMPP (http://localhost/Burger-shop/Public/index.html) to submit reservations.');
        return false;
    }

    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin text-base"></i><span>Booking Table...</span>';

    try {
        const formData = new FormData(form);
        const response = await fetch('save_reservation.php', {
            method: 'POST',
            body: formData
        });

        const result = await parseApiResponse(response);

        if (result.status === 'success') {
            submitBtn.innerHTML = '<i class="fa-solid fa-circle-check text-base"></i><span>Reservation Confirmed!</span>';
            submitBtn.classList.remove('bg-brand-red', 'hover:bg-brand-redHover');
            submitBtn.classList.add('bg-emerald-600', 'hover:bg-emerald-700');

            if (successBox) {
                const messageSpan = successBox.querySelector('span');
                if (messageSpan) {
                    messageSpan.textContent = result.message;
                }
                successBox.classList.remove('hidden');
            }

            setTimeout(() => {
                form.reset();
                if (dateInput) dateInput.min = getLocalTodayDate();
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;
                submitBtn.classList.remove('bg-emerald-600', 'hover:bg-emerald-700');
                submitBtn.classList.add('bg-brand-red', 'hover:bg-brand-redHover');
                setTimeout(() => successBox?.classList.add('hidden'), 4000);
            }, 3000);
        } else {
            alert('Error: ' + result.message);
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
        }
    } catch {
        alert('Server connection error. Make sure Apache & MySQL are running in XAMPP.');
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
    }

    return false;
}

// ==========================================
// 5. CONTACT FORM HANDLER
// ==========================================

async function handleContact(e: Event): Promise<boolean> {
    e.preventDefault();
    e.stopPropagation();

    const elements = getContactElements();
    const {
        form,
        nameInput,
        emailInput,
        phoneInput,
        subjectInput,
        messageInput,
        submitBtn,
        successBox,
        nameError,
        emailError,
        phoneError,
        subjectError,
        messageError
    } = elements;

    if (submitBtn?.disabled) {
        return false;
    }

    let isValid = true;
    let firstError: HTMLElement | null = null;

    // 1. Validate Your Name
    if (!nameInput || !nameInput.value.trim()) {
        showFieldError(nameInput, nameError, 'Name is required');
        isValid = false;
        if (!firstError) firstError = nameInput;
    } else {
        clearFieldError(nameInput, nameError);
    }

    // 2. Validate Email Address
    if (!emailInput || !emailInput.value.trim()) {
        showFieldError(emailInput, emailError, 'Email is required');
        isValid = false;
        if (!firstError) firstError = emailInput;
    } else if (!isValidEmail(emailInput.value)) {
        showFieldError(emailInput, emailError, 'Please enter a valid email address');
        isValid = false;
        if (!firstError) firstError = emailInput;
    } else {
        clearFieldError(emailInput, emailError);
    }

    // 3. Validate Contact Number
    if (!phoneInput || !phoneInput.value.trim()) {
        showFieldError(phoneInput, phoneError, 'Phone number is required');
        isValid = false;
        if (!firstError) firstError = phoneInput;
    } else if (!isValidPhone(phoneInput.value)) {
        showFieldError(phoneInput, phoneError, 'Please enter a valid 10-digit number');
        isValid = false;
        if (!firstError) firstError = phoneInput;
    } else {
        clearFieldError(phoneInput, phoneError);
    }

    // 4. Validate Subject
    if (!subjectInput || !subjectInput.value) {
        showFieldError(subjectInput, subjectError, 'Subject is required');
        isValid = false;
        if (!firstError) firstError = subjectInput;
    } else {
        clearFieldError(subjectInput, subjectError);
    }

    // 5. Validate Message
    if (!messageInput || !messageInput.value.trim()) {
        showFieldError(messageInput, messageError, 'Message is required');
        isValid = false;
        if (!firstError) firstError = messageInput;
    } else {
        clearFieldError(messageInput, messageError);
    }

    // If invalid, focus first invalid field and stop
    if (!isValid) {
        firstError?.focus();
        return false;
    }

    if (!form || !submitBtn) {
        console.error('Contact form or submit button element is missing.');
        return false;
    }

    if (window.location.protocol === 'file:') {
        alert('Please open this page through XAMPP (http://localhost/Burger-shop/Public/index.html) to send messages.');
        return false;
    }

    const originalHtml = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin text-sm"></i><span>Sending Message...</span>';

    try {
        const formData = new FormData(form);
        const response = await fetch('save_contact.php', {
            method: 'POST',
            body: formData
        });
        const result = await parseApiResponse(response);

        if (result.status === 'success') {
            submitBtn.innerHTML = '<i class="fa-solid fa-circle-check text-sm"></i><span>Message Sent Successfully!</span>';
            submitBtn.classList.remove('bg-brand-red', 'hover:bg-brand-redHover');
            submitBtn.classList.add('bg-emerald-600', 'hover:bg-emerald-700');

            if (successBox) {
                const messageSpan = successBox.querySelector('span');
                if (messageSpan) {
                    messageSpan.textContent = result.message;
                }
                successBox.classList.remove('hidden');
            }

            setTimeout(() => {
                form.reset();
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalHtml;
                submitBtn.classList.remove('bg-emerald-600', 'hover:bg-emerald-700');
                submitBtn.classList.add('bg-brand-red', 'hover:bg-brand-redHover');
                setTimeout(() => successBox?.classList.add('hidden'), 4000);
            }, 3000);
        } else {
            alert('Error: ' + result.message);
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalHtml;
        }
    } catch {
        alert('Server connection error. Make sure Apache & MySQL are running.');
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalHtml;
    }

    return false;
}

// ==========================================
// 6. ATTACH TO WINDOW OBJECT
// ==========================================

(window as any).handleReservation = handleReservation;
(window as any).handleContact = handleContact;
