/* ============================================================
   ProfileGen Wizard - local state, editors, preview, download
   ============================================================ */

var TOTAL = 6;
var currentStep = 1;
var previewTimer = null;
var finalPreviewTimer = null;
var editMode = false;
var draggedEducationIndex = null;
var draggedProjectIndex = null;

var schema = {
    meta: {
        name: '',
        title: '',
        email: '',
        tagline: '',
        bio: '',
        resumeUrl: '',
        photoBase64: '',
        faviconBase64: ''
    },
    education: [],
    theme: {
        primaryColor: '#0C9B70',
        secondaryColor: '#042444',
        accentColor: '#1db88e',
        fontFamily: 'Inter',
        borderRadius: '0.75rem',
        spacing: 'normal',
        aesthetic: 'clean',
        darkMode: true,
        hoverEffect: 'none',
        pageTransitions: false,
        animations: { enabled: true, style: 'slideUp' }
    },
    socials: { github: '', linkedin: '', twitter: '', instagram: '', website: '' },
    pages: [],
    integrations: { githubCommits: false, githubUsername: '', spotifyPlaying: false },
    siteURL: ''
};

var selectedBlocks = [
    { id: 'hero-1', type: 'hero', cols: 12, order: 0, data: {} },
    { id: 'bio-1', type: 'bio', cols: 8, order: 1, data: {} },
    { id: 'skills-1', type: 'skills', cols: 4, order: 2, data: { skills: [{ name: 'HTML/CSS', level: 90 }, { name: 'JavaScript', level: 85 }, { name: 'React', level: 75 }] } },
    { id: 'education-1', type: 'education', cols: 12, order: 3, data: {} },
    { id: 'projects-1', type: 'projects', cols: 12, order: 4, data: {} },
    { id: 'contact-1', type: 'contact', cols: 12, order: 5, data: {} }
];

var projects = [
    { title: 'My Project', category: 'Web', desc: 'Describe what you built and the result it created.', link: '', source: '', imageBase64: '' }
];

/* Returns an element by id. */
function byId(id) {
    return document.getElementById(id);
}

/* Returns a trimmed input value. */
function v(id) {
    var el = byId(id);
    return el ? el.value.trim() : '';
}

/* Sets an input value if the element exists. */
function setValue(id, value) {
    var el = byId(id);
    if (el) el.value = value || '';
}

/* Initializes all wizard event listeners. */
function initWizard() {
    byId('btnNext').addEventListener('click', goNext);
    byId('btnBack').addEventListener('click', goBack);
    byId('btnDownload').addEventListener('click', startDownload);
    byId('addEducationBtn').addEventListener('click', addEducation);
    byId('addProjectBtn').addEventListener('click', addProject);
    byId('editModeBtn').addEventListener('click', toggleEditMode);
    byId('openPreviewBtn').addEventListener('click', openPreviewModal);
    byId('closePreviewBtn').addEventListener('click', closePreviewModal);
    byId('intGithub').addEventListener('change', toggleGithubField);
    setupChoiceButtons('.aesthetic-card', 'aesthetic');
    setupChoiceButtons('.anim-card', 'animStyle');
    setupUploadZone('photoDrop', 'photoInput', 'photoError', handleProfilePhoto);
    setupUploadZone('faviconDrop', 'faviconInput', 'faviconError', handleFavicon);
    setupDeviceButtons();
    setupQuickEdit();
    document.addEventListener('input', handleAnyInput, true);
    document.addEventListener('change', handleAnyInput, true);
    renderBlockPalette();
    renderBlockCanvas();
    renderEducationList();
    renderProjectList();
    showStep(1);
    schedulePreview();
}

/* Handles global input changes and refreshes previews. */
function handleAnyInput(event) {
    if (event.target && event.target.closest && event.target.closest('#quickEdit')) return;
    schedulePreview();
}

/* Shows the requested wizard step. */
function showStep(n) {
    currentStep = n;
    document.querySelectorAll('.step').forEach(function(step) { step.classList.remove('active'); });
    document.querySelectorAll('.prog-step').forEach(function(step) {
        var stepNumber = parseInt(step.dataset.step, 10);
        step.classList.toggle('active', stepNumber === n);
        step.classList.toggle('done', stepNumber < n);
    });
    var active = document.querySelector('.step[data-step="' + n + '"]');
    if (active) active.classList.add('active');
    byId('btnBack').style.display = n === 1 ? 'none' : 'inline-flex';
    byId('btnNext').style.display = n === TOTAL ? 'none' : 'inline-flex';
    byId('generatorShell').classList.toggle('has-preview', n > 0 && n < TOTAL);
    if (n === TOTAL) {
        collectSchema();
        syncQuickEditFromMain();
        rebuildFinalPreview();
    } else {
        schedulePreview();
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* Moves to the next wizard step after validation. */
function goNext() {
    if (validate() && currentStep < TOTAL) showStep(currentStep + 1);
}

/* Moves to the previous wizard step. */
function goBack() {
    if (currentStep > 1) showStep(currentStep - 1);
}

/* Validates required fields for the current step. */
function validate() {
    if (currentStep === 1 && (!v('fullName') || !v('profTitle') || !v('tagline') || !v('bio'))) {
        alert('Please fill in Full Name, Professional Title, Tagline, and Bio.');
        return false;
    }
    if (currentStep === 2 && selectedBlocks.length === 0) {
        alert('Add at least one block.');
        return false;
    }
    return true;
}

/* Configures selectable card groups with a hidden input. */
function setupChoiceButtons(selector, hiddenId) {
    document.querySelectorAll(selector).forEach(function(button) {
        button.addEventListener('click', function() {
            document.querySelectorAll(selector).forEach(function(item) { item.classList.remove('selected'); });
            button.classList.add('selected');
            byId(hiddenId).value = button.dataset.value;
            schedulePreview();
        });
    });
}

/* Configures a drag, drop, and click upload zone. */
function setupUploadZone(zoneId, inputId, errorId, callback) {
    var zone = byId(zoneId);
    var input = byId(inputId);
    if (!zone || !input) return;
    zone.addEventListener('dragover', function(event) {
        event.preventDefault();
        zone.classList.add('dragging');
    });
    zone.addEventListener('dragleave', function() { zone.classList.remove('dragging'); });
    zone.addEventListener('drop', function(event) {
        event.preventDefault();
        zone.classList.remove('dragging');
        var file = event.dataTransfer.files && event.dataTransfer.files[0];
        if (file) callback(file, errorId);
    });
    input.addEventListener('change', function() {
        var file = input.files && input.files[0];
        if (file) callback(file, errorId);
    });
}

/* Handles profile photo upload and resizing. */
function handleProfilePhoto(file, errorId) {
    if (!validateImage(file, ['image/jpeg', 'image/png', 'image/webp'], 3 * 1024 * 1024, errorId)) return;
    resizeImage(file, 400, 400).then(function(dataUrl) {
        schema.meta.photoBase64 = dataUrl;
        byId('photoPreview').innerHTML = '<img src="' + dataUrl + '" alt="Profile preview"><button type="button" class="btn btn-secondary" id="removePhotoBtn">Remove</button>';
        byId('removePhotoBtn').addEventListener('click', function() {
            schema.meta.photoBase64 = '';
            byId('photoPreview').innerHTML = '';
            byId('photoInput').value = '';
            schedulePreview();
        });
        schedulePreview();
    }).catch(function() {
        showUploadError(errorId, 'Could not read this image.');
    });
}

/* Handles favicon upload and preview. */
function handleFavicon(file, errorId) {
    var allowed = ['image/png', 'image/svg+xml', 'image/x-icon', 'image/vnd.microsoft.icon'];
    if (!validateImage(file, allowed, 512 * 1024, errorId, ['ico', 'png', 'svg'])) return;
    readFileAsDataURL(file).then(function(dataUrl) {
        schema.meta.faviconBase64 = dataUrl;
        byId('faviconPreview').innerHTML = '<img src="' + dataUrl + '" alt="Favicon preview"><button type="button" class="btn btn-secondary" id="removeFaviconBtn">Remove</button>';
        byId('removeFaviconBtn').addEventListener('click', function() {
            schema.meta.faviconBase64 = '';
            byId('faviconPreview').innerHTML = '';
            byId('faviconInput').value = '';
            schedulePreview();
        });
        schedulePreview();
    }).catch(function() {
        showUploadError(errorId, 'Could not read this favicon.');
    });
}

/* Validates image type, extension, and size. */
function validateImage(file, allowedTypes, maxSize, errorId, allowedExts) {
    var ext = file.name.split('.').pop().toLowerCase();
    var typeOk = allowedTypes.indexOf(file.type) !== -1 || (allowedExts && allowedExts.indexOf(ext) !== -1);
    if (!typeOk) {
        showUploadError(errorId, 'Unsupported file type.');
        return false;
    }
    if (file.size > maxSize) {
        showUploadError(errorId, 'File is too large.');
        return false;
    }
    showUploadError(errorId, '');
    return true;
}

/* Displays an upload error message. */
function showUploadError(errorId, message) {
    var el = byId(errorId);
    if (el) el.textContent = message || '';
}

/* Reads a file as a data URL. */
function readFileAsDataURL(file) {
    return new Promise(function(resolve, reject) {
        var reader = new FileReader();
        reader.onload = function() { resolve(reader.result); };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

/* Resizes an image with canvas and returns a data URL. */
function resizeImage(file, maxWidth, maxHeight) {
    if (typeof createImageBitmap !== 'function') {
        return resizeImageFallback(file, maxWidth, maxHeight);
    }
    return createImageBitmap(file).then(function(bitmap) {
        var ratio = Math.min(maxWidth / bitmap.width, maxHeight / bitmap.height, 1);
        var width = Math.round(bitmap.width * ratio);
        var height = Math.round(bitmap.height * ratio);
        var canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        var ctx = canvas.getContext('2d');
        ctx.drawImage(bitmap, 0, 0, width, height);
        return canvas.toDataURL(file.type === 'image/png' ? 'image/png' : 'image/jpeg', 0.88);
    }).catch(function() {
        return resizeImageFallback(file, maxWidth, maxHeight);
    });
}

/* Resizes an image using an HTMLImageElement fallback. */
function resizeImageFallback(file, maxWidth, maxHeight) {
    return readFileAsDataURL(file).then(function(dataUrl) {
        return new Promise(function(resolve, reject) {
            var img = new Image();
            img.onload = function() {
                var ratio = Math.min(maxWidth / img.width, maxHeight / img.height, 1);
                var canvas = document.createElement('canvas');
                canvas.width = Math.round(img.width * ratio);
                canvas.height = Math.round(img.height * ratio);
                canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
                resolve(canvas.toDataURL(file.type === 'image/png' ? 'image/png' : 'image/jpeg', 0.88));
            };
            img.onerror = reject;
            img.src = dataUrl;
        });
    });
}

/* Renders the block palette. */
function renderBlockPalette() {
    var palette = byId('blockPalette');
    palette.innerHTML = Object.keys(BLOCK_REGISTRY).map(function(type) {
        var reg = BLOCK_REGISTRY[type];
        return '<button type="button" class="palette-item" data-type="' + type + '">'
            + '<span class="palette-icon">' + reg.icon + '</span>'
            + '<span class="palette-info"><span class="palette-name">' + reg.label + '</span><span class="palette-desc">' + reg.description + '</span></span>'
            + '<i class="bx bx-plus"></i>'
            + '</button>';
    }).join('');
    palette.querySelectorAll('.palette-item').forEach(function(button) {
        button.addEventListener('click', function() { addBlock(button.dataset.type); });
    });
}

/* Renders selected blocks and controls. */
function renderBlockCanvas() {
    var canvas = byId('blockCanvas');
    if (!selectedBlocks.length) {
        canvas.innerHTML = '<div class="canvas-empty">Click a block on the left to add it to your layout.</div>';
        updateBentoPreview();
        renderProjectList();
        return;
    }
    var sorted = selectedBlocks.slice().sort(function(a, b) { return a.order - b.order; });
    canvas.innerHTML = sorted.map(function(block, index) {
        var reg = BLOCK_REGISTRY[block.type] || { label: block.type, icon: '?' };
        return '<div class="canvas-block" data-id="' + block.id + '" draggable="true">'
            + '<span class="drag-handle"><i class="bx bx-grid-vertical"></i></span>'
            + '<div class="canvas-block__main"><span class="palette-icon">' + reg.icon + '</span><span class="canvas-block__name">' + reg.label + '</span></div>'
            + '<div class="canvas-block__controls">'
            + '<select class="canvas-col-select" data-action="cols"><option value="4">4 col</option><option value="6">6 col</option><option value="8">8 col</option><option value="12">12 col</option></select>'
            + '<button type="button" class="btn btn-secondary btn-icon" data-action="up"' + (index === 0 ? ' disabled' : '') + '><i class="bx bx-up-arrow-alt"></i></button>'
            + '<button type="button" class="btn btn-secondary btn-icon" data-action="down"' + (index === sorted.length - 1 ? ' disabled' : '') + '><i class="bx bx-down-arrow-alt"></i></button>'
            + '<button type="button" class="btn btn-danger btn-icon" data-action="remove"><i class="bx bx-x"></i></button>'
            + '</div></div>';
    }).join('');
    canvas.querySelectorAll('.canvas-block').forEach(function(row) {
        var block = selectedBlocks.find(function(item) { return item.id === row.dataset.id; });
        row.querySelector('[data-action="cols"]').value = String(block.cols || 12);
        row.querySelector('[data-action="cols"]').addEventListener('change', function(event) { setBlockCols(block.id, event.target.value); });
        row.querySelector('[data-action="up"]').addEventListener('click', function() { moveBlock(block.id, -1); });
        row.querySelector('[data-action="down"]').addEventListener('click', function() { moveBlock(block.id, 1); });
        row.querySelector('[data-action="remove"]').addEventListener('click', function() { removeBlock(block.id); });
        row.addEventListener('dragstart', function() { row.classList.add('dragging'); row.dataset.dragging = 'true'; });
        row.addEventListener('dragend', function() { row.classList.remove('dragging'); delete row.dataset.dragging; });
        row.addEventListener('dragover', function(event) { event.preventDefault(); });
        row.addEventListener('drop', function(event) {
            event.preventDefault();
            var dragging = canvas.querySelector('[data-dragging="true"]');
            if (dragging && dragging !== row) reorderByIds(dragging.dataset.id, row.dataset.id, selectedBlocks);
        });
    });
    updateBentoPreview();
    renderProjectList();
}

/* Adds a block to the layout. */
function addBlock(type) {
    var reg = BLOCK_REGISTRY[type];
    selectedBlocks.push({ id: type + '-' + Date.now(), type: type, cols: reg ? reg.defaultCols : 12, order: selectedBlocks.length, data: {} });
    if (type === 'projects' && !projects.length) addProject();
    reorderBlocks();
    renderBlockCanvas();
    schedulePreview();
}

/* Removes a block from the layout. */
function removeBlock(id) {
    selectedBlocks = selectedBlocks.filter(function(block) { return block.id !== id; });
    reorderBlocks();
    renderBlockCanvas();
    schedulePreview();
}

/* Moves a block up or down. */
function moveBlock(id, direction) {
    var index = selectedBlocks.findIndex(function(block) { return block.id === id; });
    var target = index + direction;
    if (index < 0 || target < 0 || target >= selectedBlocks.length) return;
    var temp = selectedBlocks[index];
    selectedBlocks[index] = selectedBlocks[target];
    selectedBlocks[target] = temp;
    reorderBlocks();
    renderBlockCanvas();
    schedulePreview();
}

/* Reorders block or entry arrays by dragged and target ids. */
function reorderByIds(fromId, toId, collection) {
    var from = collection.findIndex(function(item) { return item.id === fromId; });
    var to = collection.findIndex(function(item) { return item.id === toId; });
    if (from < 0 || to < 0) return;
    var moved = collection.splice(from, 1)[0];
    collection.splice(to, 0, moved);
    reorderBlocks();
    renderBlockCanvas();
    schedulePreview();
}

/* Sets the grid column span for a block. */
function setBlockCols(id, cols) {
    var block = selectedBlocks.find(function(item) { return item.id === id; });
    if (block) block.cols = parseInt(cols, 10) || 12;
    updateBentoPreview();
    schedulePreview();
}

/* Normalizes block order values. */
function reorderBlocks() {
    selectedBlocks.forEach(function(block, index) { block.order = index; });
}

/* Updates the small bento layout preview. */
function updateBentoPreview() {
    var preview = byId('bentoPreview');
    var sorted = selectedBlocks.slice().sort(function(a, b) { return a.order - b.order; });
    preview.innerHTML = sorted.map(function(block) {
        var reg = BLOCK_REGISTRY[block.type] || { label: block.type, icon: '?' };
        return '<span class="preview-cell" style="width:' + Math.max(28, Math.round((block.cols || 12) / 12 * 100)) + '%">' + reg.icon + ' ' + reg.label + '</span>';
    }).join('');
}

/* Adds a blank education entry. */
function addEducation() {
    schema.education.push({ institution: '', degree: '', field: '', startYear: '', endYear: '', grade: '', description: '' });
    renderEducationList();
    schedulePreview();
}

/* Renders education entry cards. */
function renderEducationList() {
    var list = byId('educationList');
    if (!schema.education.length) {
        list.innerHTML = '<p class="muted">No education entries yet.</p>';
        return;
    }
    list.innerHTML = schema.education.map(function(item, index) {
        return '<article class="entry-card" draggable="true" data-index="' + index + '">'
            + '<div class="entry-card__head"><span class="entry-card__title"><i class="bx bx-grid-vertical drag-handle"></i> Education ' + (index + 1) + '</span><div class="button-row">'
            + '<button type="button" class="btn btn-secondary btn-icon" data-action="up"' + (index === 0 ? ' disabled' : '') + '><i class="bx bx-up-arrow-alt"></i></button>'
            + '<button type="button" class="btn btn-secondary btn-icon" data-action="down"' + (index === schema.education.length - 1 ? ' disabled' : '') + '><i class="bx bx-down-arrow-alt"></i></button>'
            + '<button type="button" class="btn btn-danger btn-icon" data-action="delete"><i class="bx bx-trash"></i></button></div></div>'
            + '<div class="field-row"><div class="field"><label>Institution name</label><input data-field="institution" value="' + esc(item.institution) + '"></div><div class="field"><label>Degree / Course name</label><input data-field="degree" value="' + esc(item.degree) + '"></div></div>'
            + '<div class="field-row"><div class="field"><label>Field of study</label><input data-field="field" value="' + esc(item.field) + '"></div><div class="field"><label>Grade / GPA</label><input data-field="grade" value="' + esc(item.grade) + '"></div></div>'
            + '<div class="field-row"><div class="field"><label>Start year</label><input type="number" min="1900" max="2100" data-field="startYear" value="' + esc(item.startYear) + '"></div><div class="field"><label>End year</label><input data-field="endYear" value="' + esc(item.endYear) + '" placeholder="Present"></div></div>'
            + '<div class="field"><label>Description</label><textarea maxlength="200" data-field="description">' + esc(item.description) + '</textarea><p class="hint">Max 200 characters.</p></div>'
            + '</article>';
    }).join('');
    list.querySelectorAll('.entry-card').forEach(bindEducationCard);
}

/* Binds education card controls. */
function bindEducationCard(card) {
    var index = parseInt(card.dataset.index, 10);
    card.querySelectorAll('[data-field]').forEach(function(input) {
        input.addEventListener('input', function() {
            schema.education[index][input.dataset.field] = input.value;
            schedulePreview();
        });
    });
    card.querySelector('[data-action="delete"]').addEventListener('click', function() {
        schema.education.splice(index, 1);
        renderEducationList();
        schedulePreview();
    });
    card.querySelector('[data-action="up"]').addEventListener('click', function() { moveEducation(index, -1); });
    card.querySelector('[data-action="down"]').addEventListener('click', function() { moveEducation(index, 1); });
    card.addEventListener('dragstart', function() { draggedEducationIndex = index; });
    card.addEventListener('dragover', function(event) { event.preventDefault(); });
    card.addEventListener('drop', function(event) {
        event.preventDefault();
        if (draggedEducationIndex !== null && draggedEducationIndex !== index) {
            var moved = schema.education.splice(draggedEducationIndex, 1)[0];
            schema.education.splice(index, 0, moved);
            draggedEducationIndex = null;
            renderEducationList();
            schedulePreview();
        }
    });
}

/* Moves an education entry. */
function moveEducation(index, direction) {
    var target = index + direction;
    if (target < 0 || target >= schema.education.length) return;
    var temp = schema.education[index];
    schema.education[index] = schema.education[target];
    schema.education[target] = temp;
    renderEducationList();
    schedulePreview();
}

/* Adds a blank project entry. */
function addProject() {
    projects.push({ title: '', category: '', desc: '', link: '', source: '', imageBase64: '' });
    renderProjectList();
    schedulePreview();
}

/* Renders the project editor when the projects block is selected. */
function renderProjectList() {
    var editor = byId('projectEditor');
    var list = byId('projectList');
    var hasProjects = selectedBlocks.some(function(block) { return block.type === 'projects'; });
    editor.classList.toggle('visible', hasProjects);
    if (!hasProjects) return;
    if (!projects.length) projects.push({ title: '', category: '', desc: '', link: '', source: '', imageBase64: '' });
    list.innerHTML = projects.map(function(project, index) {
        return '<article class="entry-card" draggable="true" data-index="' + index + '">'
            + '<div class="entry-card__head"><span class="entry-card__title"><i class="bx bx-grid-vertical drag-handle"></i> Project ' + (index + 1) + '</span><div class="button-row">'
            + '<button type="button" class="btn btn-secondary btn-icon" data-action="up"' + (index === 0 ? ' disabled' : '') + '><i class="bx bx-up-arrow-alt"></i></button>'
            + '<button type="button" class="btn btn-secondary btn-icon" data-action="down"' + (index === projects.length - 1 ? ' disabled' : '') + '><i class="bx bx-down-arrow-alt"></i></button>'
            + '<button type="button" class="btn btn-danger btn-icon" data-action="delete"><i class="bx bx-trash"></i></button></div></div>'
            + '<div class="field-row"><div class="field"><label>Title</label><input data-field="title" value="' + esc(project.title) + '"></div><div class="field"><label>Category</label><input data-field="category" value="' + esc(project.category) + '"></div></div>'
            + '<div class="field"><label>Description</label><textarea data-field="desc">' + esc(project.desc) + '</textarea></div>'
            + '<div class="field-row"><div class="field"><label>Live URL</label><input data-field="link" value="' + esc(project.link) + '"></div><div class="field"><label>Source URL</label><input data-field="source" value="' + esc(project.source) + '"></div></div>'
            + '<div class="field"><label>Project Image</label><label class="upload-zone project-upload"><input type="file" accept="image/jpeg,image/png,image/webp"><i class="bx bx-image-add"></i><span>Upload JPG, PNG, or WebP. Max 3MB.</span></label><div class="upload-error"></div><div class="image-preview project-image-preview">' + (project.imageBase64 ? '<img src="' + project.imageBase64 + '" alt="Project preview"><button type="button" class="btn btn-secondary" data-action="remove-image">Remove</button>' : '') + '</div></div>'
            + '</article>';
    }).join('');
    list.querySelectorAll('.entry-card').forEach(bindProjectCard);
}

/* Binds project card controls and upload handlers. */
function bindProjectCard(card) {
    var index = parseInt(card.dataset.index, 10);
    card.querySelectorAll('[data-field]').forEach(function(input) {
        input.addEventListener('input', function() {
            projects[index][input.dataset.field] = input.value;
            schedulePreview();
        });
    });
    card.querySelector('[data-action="delete"]').addEventListener('click', function() {
        projects.splice(index, 1);
        renderProjectList();
        schedulePreview();
    });
    card.querySelector('[data-action="up"]').addEventListener('click', function() { moveProject(index, -1); });
    card.querySelector('[data-action="down"]').addEventListener('click', function() { moveProject(index, 1); });
    var removeImage = card.querySelector('[data-action="remove-image"]');
    if (removeImage) {
        removeImage.addEventListener('click', function() {
            projects[index].imageBase64 = '';
            renderProjectList();
            schedulePreview();
        });
    }
    var upload = card.querySelector('.project-upload input');
    var uploadZone = card.querySelector('.project-upload');
    var error = card.querySelector('.upload-error');
    /* Handles an uploaded project image file. */
    function handleProjectFile(file) {
        if (!file) return;
        if (!validateImage(file, ['image/jpeg', 'image/png', 'image/webp'], 3 * 1024 * 1024, null)) {
            error.textContent = 'Use JPG, PNG, or WebP under 3MB.';
            return;
        }
        error.textContent = '';
        resizeImage(file, 800, 450).then(function(dataUrl) {
            projects[index].imageBase64 = dataUrl;
            renderProjectList();
            schedulePreview();
        });
    }
    upload.addEventListener('change', function() {
        handleProjectFile(upload.files && upload.files[0]);
    });
    uploadZone.addEventListener('dragover', function(event) {
        event.preventDefault();
        uploadZone.classList.add('dragging');
    });
    uploadZone.addEventListener('dragleave', function() {
        uploadZone.classList.remove('dragging');
    });
    uploadZone.addEventListener('drop', function(event) {
        event.preventDefault();
        uploadZone.classList.remove('dragging');
        handleProjectFile(event.dataTransfer.files && event.dataTransfer.files[0]);
    });
    card.addEventListener('dragstart', function() { draggedProjectIndex = index; });
    card.addEventListener('dragover', function(event) { event.preventDefault(); });
    card.addEventListener('drop', function(event) {
        event.preventDefault();
        if (draggedProjectIndex !== null && draggedProjectIndex !== index) {
            var moved = projects.splice(draggedProjectIndex, 1)[0];
            projects.splice(index, 0, moved);
            draggedProjectIndex = null;
            renderProjectList();
            schedulePreview();
        }
    });
}

/* Moves a project entry. */
function moveProject(index, direction) {
    var target = index + direction;
    if (target < 0 || target >= projects.length) return;
    var temp = projects[index];
    projects[index] = projects[target];
    projects[target] = temp;
    renderProjectList();
    schedulePreview();
}

/* Builds a full schema object from current form state. */
function collectSchema() {
    var skillBlock = selectedBlocks.find(function(block) { return block.type === 'skills'; });
    if (skillBlock) skillBlock.data.skills = parseSkills(v('skillsInput'));
    var projectBlock = selectedBlocks.find(function(block) { return block.type === 'projects'; });
    if (projectBlock) projectBlock.data.projects = projects.slice();
    schema.meta.name = v('fullName');
    schema.meta.title = v('profTitle');
    schema.meta.email = v('email');
    schema.meta.tagline = v('tagline');
    schema.meta.bio = v('bio');
    schema.meta.resumeUrl = v('resumeUrl');
    schema.socials.github = socialURL('github', v('github'));
    schema.socials.linkedin = socialURL('linkedin', v('linkedin'));
    schema.socials.twitter = socialURL('twitter', v('twitter'));
    schema.socials.instagram = socialURL('instagram', v('instagram'));
    schema.socials.website = v('website');
    schema.theme.primaryColor = byId('primaryColor').value;
    schema.theme.secondaryColor = byId('secondaryColor').value;
    schema.theme.accentColor = byId('accentColor').value;
    schema.theme.fontFamily = byId('fontFamily').value;
    schema.theme.borderRadius = byId('borderRadius').value;
    schema.theme.spacing = byId('spacingSelect').value;
    schema.theme.aesthetic = byId('aesthetic').value;
    schema.theme.darkMode = byId('darkMode').checked;
    schema.theme.hoverEffect = byId('hoverEffect').value;
    schema.theme.pageTransitions = byId('pageTransitions').checked;
    schema.theme.animations.enabled = byId('animEnabled').checked;
    schema.theme.animations.style = byId('animStyle').value;
    schema.integrations.githubCommits = byId('intGithub').checked;
    schema.integrations.githubUsername = v('ghUsername');
    schema.integrations.spotifyPlaying = byId('intSpotify').checked;
    schema.siteURL = v('siteURL');
    var blocks = selectedBlocks.slice();
    if (schema.integrations.githubCommits && !blocks.some(function(block) { return block.type === 'githubFeed'; })) {
        blocks.push({ id: 'github-auto', type: 'githubFeed', cols: 6, order: blocks.length, data: {} });
    }
    if (schema.integrations.spotifyPlaying && !blocks.some(function(block) { return block.type === 'spotify'; })) {
        blocks.push({ id: 'spotify-auto', type: 'spotify', cols: 6, order: blocks.length, data: {} });
    }
    schema.pages = [{ name: 'index', blocks: blocks }];
    return schema;
}

/* Parses comma-separated skill input into structured skills. */
function parseSkills(raw) {
    if (!raw) return [{ name: 'HTML/CSS', level: 90 }, { name: 'JavaScript', level: 85 }, { name: 'React', level: 75 }];
    return raw.split(',').map(function(part, index) {
        var pieces = part.trim().split(':');
        return { name: (pieces[0] || 'Skill').trim(), level: parseInt(pieces[1], 10) || Math.max(60, 90 - index * 8) };
    });
}

/* Builds a social URL from a platform username. */
function socialURL(platform, username) {
    if (!username) return '';
    if (/^https?:\/\//i.test(username)) return username;
    return { github: 'https://github.com/', linkedin: 'https://linkedin.com/in/', twitter: 'https://twitter.com/', instagram: 'https://instagram.com/' }[platform] + username.replace(/^@/, '');
}

/* Schedules the live preview rebuild with debounce. */
function schedulePreview() {
    var badge = byId('previewBadge');
    if (badge) badge.classList.add('visible');
    clearTimeout(previewTimer);
    previewTimer = setTimeout(rebuildPreview, 400);
    if (currentStep === TOTAL) scheduleFinalPreview();
}

/* Rebuilds the desktop and modal live previews. */
function rebuildPreview() {
    var liveFrame = byId('livePreviewFrame');
    var modalFrame = byId('modalPreviewFrame');
    var finalSchema = collectSchema();
    var html = compilePage({ name: 'index', blocks: finalSchema.pages[0].blocks }, finalSchema, true);
    writeFrame(liveFrame, html);
    writeFrame(modalFrame, html);
    var badge = byId('previewBadge');
    if (badge) badge.classList.remove('visible');
}

/* Schedules the final preview rebuild with debounce. */
function scheduleFinalPreview() {
    clearTimeout(finalPreviewTimer);
    finalPreviewTimer = setTimeout(rebuildFinalPreview, 300);
}

/* Rebuilds the final preview iframe and reapplies edit mode. */
function rebuildFinalPreview() {
    var finalSchema = collectSchema();
    var html = compilePage({ name: 'index', blocks: finalSchema.pages[0].blocks }, finalSchema, true);
    writeFrame(byId('finalPreviewFrame'), html);
    if (editMode) setTimeout(bindInlineEditor, 50);
}

/* Writes HTML into an iframe document. */
function writeFrame(frame, html) {
    if (!frame) return;
    var doc = frame.contentDocument || frame.contentWindow.document;
    doc.open();
    doc.write(html);
    doc.close();
}

/* Configures device width buttons for preview iframes. */
function setupDeviceButtons() {
    document.querySelectorAll('.device-tabs').forEach(function(group) {
        group.querySelectorAll('.device-btn').forEach(function(button) {
            button.addEventListener('click', function() {
                group.querySelectorAll('.device-btn').forEach(function(btn) { btn.classList.remove('active'); });
                button.classList.add('active');
                setPreviewWidth(group.dataset.target, button.dataset.width);
            });
        });
    });
}

/* Applies a device width to the selected preview frame. */
function setPreviewWidth(target, width) {
    var frames = target === 'final' ? [byId('finalPreviewFrame')] : [byId('livePreviewFrame'), byId('modalPreviewFrame')];
    frames.forEach(function(frame) {
        if (!frame) return;
        frame.style.width = width === 'full' ? '100%' : width + 'px';
        frame.style.maxWidth = '100%';
    });
}

/* Opens the mobile preview modal. */
function openPreviewModal() {
    rebuildPreview();
    byId('previewModal').classList.add('visible');
    byId('previewModal').setAttribute('aria-hidden', 'false');
}

/* Closes the mobile preview modal. */
function closePreviewModal() {
    byId('previewModal').classList.remove('visible');
    byId('previewModal').setAttribute('aria-hidden', 'true');
}

/* Toggles the GitHub integration username field. */
function toggleGithubField() {
    byId('githubIntegrationField').style.display = byId('intGithub').checked ? 'block' : 'none';
    schedulePreview();
}

/* Toggles final preview inline edit mode. */
function toggleEditMode() {
    editMode = !editMode;
    byId('editModeBtn').classList.toggle('btn-primary', editMode);
    byId('editModeBtn').classList.toggle('btn-secondary', !editMode);
    byId('quickEdit').classList.toggle('visible', editMode);
    if (editMode) bindInlineEditor();
    else unbindInlineEditor();
}

/* Enables contenteditable fields inside the final iframe. */
function bindInlineEditor() {
    var frame = byId('finalPreviewFrame');
    var doc = frame && frame.contentDocument;
    if (!doc) return;
    var style = doc.createElement('style');
    style.id = 'inline-edit-style';
    style.textContent = 'body.editing::before{content:"";position:fixed;inset:0;background:rgba(12,155,112,.035);pointer-events:none;z-index:9999}[data-schema-field][contenteditable="true"]{outline:2px dashed var(--primary);outline-offset:3px;cursor:text;background:rgba(12,155,112,.08)}';
    if (!doc.getElementById('inline-edit-style')) doc.head.appendChild(style);
    doc.body.classList.add('editing');
    doc.querySelectorAll('[data-schema-field]').forEach(function(el) {
        el.setAttribute('contenteditable', 'true');
        el.addEventListener('blur', handleInlineEditBlur);
    });
}

/* Disables contenteditable fields inside the final iframe. */
function unbindInlineEditor() {
    var frame = byId('finalPreviewFrame');
    var doc = frame && frame.contentDocument;
    if (!doc) return;
    doc.body.classList.remove('editing');
    doc.querySelectorAll('[data-schema-field]').forEach(function(el) {
        el.removeAttribute('contenteditable');
        el.removeEventListener('blur', handleInlineEditBlur);
    });
}

/* Saves an inline edited value back to the schema and form controls. */
function handleInlineEditBlur(event) {
    var field = event.currentTarget.getAttribute('data-schema-field');
    var value = event.currentTarget.textContent.trim();
    updateSchemaField(field, value);
    showSaveToast();
    scheduleFinalPreview();
    schedulePreview();
}

/* Updates a supported schema field path from inline editing. */
function updateSchemaField(field, value) {
    var parts = field.split('.');
    if (parts[0] === 'meta') {
        var map = { name: 'fullName', title: 'profTitle', tagline: 'tagline', bio: 'bio', email: 'email' };
        schema.meta[parts[1]] = value;
        setValue(map[parts[1]], value);
    }
    if (parts[0] === 'project') {
        var pIndex = parseInt(parts[2], 10);
        if (projects[pIndex]) {
            if (parts[1] === 'title') projects[pIndex].title = value;
            if (parts[1] === 'desc') projects[pIndex].desc = value;
            renderProjectList();
        }
    }
    if (parts[0] === 'edu') {
        var eIndex = parseInt(parts[2], 10);
        if (schema.education[eIndex]) {
            if (parts[1] === 'institution') schema.education[eIndex].institution = value;
            if (parts[1] === 'degree') schema.education[eIndex].degree = value;
            renderEducationList();
        }
    }
}

/* Shows the small saved toast. */
function showSaveToast() {
    var toast = byId('saveToast');
    toast.classList.add('visible');
    clearTimeout(toast._timer);
    toast._timer = setTimeout(function() { toast.classList.remove('visible'); }, 1500);
}

/* Wires quick edit controls to main design inputs. */
function setupQuickEdit() {
    ['Primary', 'Secondary', 'Accent'].forEach(function(name) {
        byId('quick' + name).addEventListener('input', function(event) {
            byId(name.charAt(0).toLowerCase() + name.slice(1) + 'Color').value = event.target.value;
            scheduleFinalPreview();
            schedulePreview();
        });
    });
    byId('quickFont').addEventListener('change', function(event) {
        byId('fontFamily').value = event.target.value;
        scheduleFinalPreview();
        schedulePreview();
    });
}

/* Syncs quick edit controls from the main design form. */
function syncQuickEditFromMain() {
    byId('quickPrimary').value = byId('primaryColor').value;
    byId('quickSecondary').value = byId('secondaryColor').value;
    byId('quickAccent').value = byId('accentColor').value;
    byId('quickFont').value = byId('fontFamily').value;
}

/* Generates and downloads the ZIP. */
async function startDownload() {
    var button = byId('btnDownload');
    button.disabled = true;
    button.innerHTML = '<i class="bx bx-loader-alt bx-spin"></i> Generating...';
    try {
        var finalSchema = collectSchema();
        var zip = buildZIP(finalSchema);
        var blob = await zip.generateAsync({ type: 'blob', compression: 'DEFLATE' });
        var slug = (finalSchema.meta.name || 'portfolio').replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '').toLowerCase() || 'portfolio';
        saveAs(blob, slug + '-portfolio.zip');
        button.innerHTML = '<i class="bx bx-check"></i> Downloaded';
        setTimeout(function() {
            button.disabled = false;
            button.innerHTML = '<i class="bx bx-download"></i> Download ZIP';
        }, 2200);
    } catch (error) {
        console.error('ProfileGen error:', error);
        alert('Something went wrong generating your ZIP. Check the console for details.');
        button.disabled = false;
        button.innerHTML = '<i class="bx bx-download"></i> Download ZIP';
    }
}

/* Attempts to fill education from parsed resume text when available. */
function fillFormFromResume(text) {
    if (!text) return;
    var lines = text.split(/\r?\n/).map(function(line) { return line.trim(); }).filter(Boolean);
    var eduIndex = lines.findIndex(function(line) { return /education|degree|university|college|school/i.test(line); });
    if (eduIndex >= 0 && !schema.education.length) {
        schema.education.push({
            institution: lines[eduIndex + 1] || '',
            degree: lines[eduIndex + 2] || '',
            field: '',
            startYear: '',
            endYear: '',
            grade: '',
            description: ''
        });
        renderEducationList();
        schedulePreview();
    }
}

initWizard();
