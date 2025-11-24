const fs = require('fs');
const path = require('path');
const readline = require('readline');

let typeMap;
//Планы: Сохранять лог перемещений чтобы можно было откатить

try {
    const configText = fs.readFileSync('config.json', 'utf8');
    typeMap = JSON.parse(configText);
    console.log('✅ Настройки загружены из файла');
} catch (error) {
    // Если ошибка - используем стандартные настройки
    typeMap = {
        'jpg': 'Images',
        'jpeg': 'Images', 
        'png': 'Images',
        'gif': 'Images',
        'pdf': 'Documents',
        'doc': 'Documents',
        'docx': 'Documents',
        'txt': 'Documents',
        'zip': 'Archives',
        'rar': 'Archives',
        'mp4': 'Videos',
        'mov': 'Videos',
        'mp3': 'Music',
        'wav': 'Music'
    };
    console.log('⚠️  Используются стандартные настройки');
}

//Интерфейс для ввода

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function ask(question) {
    return new Promise((resolve) => {
        rl.question(question, (answer) => {
            resolve(answer);
        });
    });
}

// Функция для выбора папки
async function chooseFolder() {
    console.log('\n📁 ВЫБОР ПАПКИ ДЛЯ СОРТИРОВКИ:');
    console.log('1. Папка Загрузки (по умолчанию)');
    console.log('2. Текущая папка');
    console.log('3. Указать путь вручную');
    
    const choice = await ask('\nВыберите вариант (1/2/3): ');
    
    switch(choice) {
        case '1':
            return require('os').homedir() + '/Downloads';
        case '2':
            return process.cwd();
        case '3':
            const customPath = await ask('Введите путь к папке: ');
            return customPath.trim();
        default:
            console.log('Используется папка Загрузки по умолчанию');
            return require('os').homedir() + '/Downloads';
    }
}

// Функция для проверки существования папки
function checkFolderExists(folderPath) {
    if (!fs.existsSync(folderPath)) {
        console.log(`❌ Папка не существует: ${folderPath}`);
        return false;
    }
    return true;
}

// Функция, которая определяет тип файла по расширению
function getFolderName(filename) {
    const extension = filename.split('.').pop().toLowerCase();
    return typeMap[extension] || 'Other';
}
// Функция для создания папки, если её нет
function ensureFolderExists(folderPath) {
    if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath);
        console.log('Создана папка: ' + folderPath);
    }
}

// Функция для перемещения файла
function moveFile(oldPath, newPath) {
    try {
        fs.renameSync(oldPath, newPath);
        console.log('✓ Успешно: ' + path.basename(oldPath) + ' → ' + path.basename(path.dirname(newPath)));
        return true;
    } catch (error) {
        console.log('✗ Ошибка с файлом ' + path.basename(oldPath) + ': ' + error.message);
        return false;
    }
}

// ОСНОВНОЙ КОД
async function main() {
    // ВЫБИРАЕМ ПАПКУ для сортировки
    const sortFolder = await chooseFolder();
    
    // Проверяем что папка существует
    if (!checkFolderExists(sortFolder)) {
        console.log('❌ Программа завершена');
        rl.close();
        return;
    }
    
    console.log(`🔍 Сканирую папку: ${sortFolder}`);
    
    // Используем выбранную папку вместо жестко заданной
    const files = fs.readdirSync(sortFolder).filter(item => {
        const itemPath = path.join(sortFolder, item);
        return fs.statSync(itemPath).isFile() && !item.startsWith('.');
    });
    
    if (files.length === 0) {
        console.log("📁 Файлов для сортировки не найдено");
        rl.close();
        return;
    }
    
    // ПОКАЗЫВАЕМ ПЛАН
    console.log('\n📋 ПЛАН СОРТИРОВКИ:');
    console.log('================');
    
    files.forEach(file => {
        const folder = getFolderName(file);
        console.log(`📄 ${file} → 📁 ${folder}`);
    });
    
    console.log('\nВсего файлов: ' + files.length);
    
    // СПРАШИВАЕМ ПОДТВЕРЖДЕНИЕ
    const answer = await ask('\n✅ Выполнить сортировку? (y/n): ');
    
    if (answer.toLowerCase() !== 'y') {
        console.log('❌ Сортировка отменена');
        rl.close();
        return;
    }
    
    // ВЫПОЛНЯЕМ СОРТИРОВКУ
    console.log('\n🔄 Начинаю сортировку...');
    
    // Создаем папки В ВЫБРАННОЙ ПАПКЕ
    const folders = new Set();
    files.forEach(file => folders.add(getFolderName(file)));
    folders.forEach(folder => ensureFolderExists(path.join(sortFolder, folder)));
    
    // Перемещаем файлы В ВЫБРАННОЙ ПАПКЕ
    let movedCount = 0;
    files.forEach(file => {
        const folder = getFolderName(file);
        const oldPath = path.join(sortFolder, file);
        const newPath = path.join(sortFolder, folder, file);
        
        if (moveFile(oldPath, newPath)) {
            movedCount++;
        }
    });
    
    console.log(`\n🎉 Готово! Перемещено ${movedCount} из ${files.length} файлов`);
    console.log(`📁 Папка: ${sortFolder}`);
    rl.close();
}

// Запускаем программу
main();