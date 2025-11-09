const fs = require('fs');
const path = require('path');
const readline = require('readline');

//Планы: Сохранять лог перемещений чтобы можно было откатить


// Создаем интерфейс для ввода
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Функция для вопроса
function ask(question) {
    return new Promise((resolve) => {
        rl.question(question, (answer) => {
            resolve(answer);
        });
    });
}
// Функция, которая определяет тип файла по расширению
function getFolderName(filename) {
    // Получаем расширение файла (последние буквы после точки)
    const extension = filename.split('.').pop().toLowerCase();
    
    // Словарь: расширение -> папка
    const typeMap = {
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
    
    // Если расширение есть в словаре - возвращаем папку, иначе 'Other'
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
    console.log("🔍 Сканирую папку Загрузки...");
    
    const downloadsPath = require('os').homedir() + '/Downloads';
    
    const files = fs.readdirSync(downloadsPath).filter(item => {
        const itemPath = `${downloadsPath}/${item}`;
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
    
    // Создаем папки
    const folders = new Set();
    files.forEach(file => folders.add(getFolderName(file)));
    folders.forEach(folder => ensureFolderExists(`${downloadsPath}/${folder}`));
    
    // Перемещаем файлы
    let movedCount = 0;
    files.forEach(file => {
        const folder = getFolderName(file);
        const oldPath = `${downloadsPath}/${file}`;
        const newPath = `${downloadsPath}/${folder}/${file}`;
        
        if (moveFile(oldPath, newPath)) {
            movedCount++;
        }
    });
    
    console.log(`\n🎉 Готово! Перемещено ${movedCount} из ${files.length} файлов`);
    rl.close();
}

// Запускаем программу
main();