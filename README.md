# JC - Javascript Compute

Данный модуль обеспечивает возможность GPGPU OOP на мета-языке JC с последущей
трансляцией на различные платформы: OpenCL, CUDA, GLSL... Точнее, будет обеспечивать
когда если вдруг заработает.

----

*WIP-DISCLAIMER:* То, что описано в тексте ниже - это черновик спецификации JC.
Не гарантируется, что в любой конкретный момент *node-jc* будет следовать
спецификации или даже работать вообще. Данный червновик является предметом
активных изменений.

----


## Подключение и спецификация модулей

Из ноды подключение через `jc.require()` срабатывает по тем же правилам, что и `import`
внутри JC кода. В случае `jc.require()` возвращается объект со всеми классами, которые
удалось загрузить, в виде его ключей. Использование отдельной версии `require`
обоснованно удобством и личными предпочтениями автора с одной стороны, и нежеланием
использовать *[DEPRECATED]*`require.extensions` - с другой.

```
const jc = require('node-jc');
const {Class1, Class2} = jc.require('./classes');
```

Когда подключение происходит из JC кода, предполагается обязательное перечисление
импортируемых классов. Источник указывается как имя папки или файла. Для файла
расширение `.jc` можно опускать. Для папки загружены будут ВСЕ JC файлы, найденные
внутри, и все подпапки рекурсивно. Если импортируется путь `path` и ему неоднозначно
соответствуют и папка и файл, то приоритет отдаётся папке. Для загрузки файла в
такой ситуации следует указать его расширение, убирая таким образом неоднозначность.
Этим и объясняется отдача приоритета директории: ей нельзя добавить расширение для
разрешения неоднозначности. При импорте в JC коде следует перечислить один или
несколько импортируемых классов. Импорт перечисления и перечисление импортов
равнозначны, так как модули кэшируются по мере сборки. Для обеспечения читаемости
кода можно смело разбивать один большой импорт на много строк. Импорты в JC коде
обязаны располагаться выше любого описания классов.

```
//const {Class1, Class2} = jc.require('classes');
import Class1, Class2 from classes
```

В JC импорте не нужно указывать ковычки для пути. Всё начиная с первого значащего
символа после `from` трактуется как путь. Кроме того, нет необходимости указывать
для локальных путей точку, так как импортер будет искать файлы именно в
локальной папке.

Для того чтобы загрузить модуль из ближайшей папки *node_modules* следует указать
префикс `node:` в имени загружаемого модуля.

```
//const {Class1, Class2} = jc.require('node:classes');
import Class1, Class2 from node:classes
```

Кроме этого есть возможность указать одну или несколько папок с библиотеками, при
конфигурировании JC:

```
const jc = require('node-jc');
jc.libs('my-libs');
jc.libs('../their-libs');
```

Это позволит использовать префикс `libs:` для автоматического поиска указанного
модуля в пределах перечисленных директорий.

```
//const {Class1, Class2} = jc.require('libs:classes');
import Class1, Class2 from libs:classes
```

----

## Описание классов

Классы описываются в JC файле ниже импортов и такое описание представляет собой
имя класса, после которого возможно указание другого класса (через `extends`),
от которого данный наследуется, и затем описание класса в фигурных скобках.

```
MyClass {
	...
}

MySecondClass extends MyClass {
	...
}
```


### Свойства

Доступны 2 вида свойств: динамические и статические.

1. Динамические: аналогичны понятию атрибута в GLSL, для каждого экземпляра класса,
например для каждой вершины, такое свойство (например её позиция) имеет независимое
значение. Соответственно, эти свойства могут использоваться как видео-буферы (VBO).
2. Статические: аналогичны понятию юниформа в GLSL, имеют общее значение для всех
экземпляров. В основном имеет смысл использовать в качестве констант для разного
рода коэфициентов, или как способ передачи информации с CPU. Также могут быть
несовместимы с GPU: такие свойства объявляются с типом `js` и не видны GPU коду.

В объявлении свойств обязательно указывать тип данных. Одна строка одно
свойство. Через запятую несколько свойств на одной строке - нельзя. В качестве
типов GPU свойств могут выступать:
* Скалярные типы: `float, int, uint, char, uchar, short, ushort`.
* Векторные типы: `type`+`N`, где N = 2, 3, 4. Например, `float2, int3, char4`
`char`, `int`, `float` и JC классы/списки.
* Структурные типы: `type{a,b,c}`.
* JC классы и динамические списки: `MyClass` или `MyClass[]`.
* JS свойства: тип `js` и хранение произвольных JS данных.

Структурные типы полезны для организации облаков сложных объектов, таких как
линии и треугольники. Если некоторый JC класс должен соответствовать каждой
своей инстанцией некоторому треугольнику на экране, то наиболее логичным будет
использование структурного типа `float3{a,b,c}`. Гарантируется, что в памяти
структурный тип будет представлен в том порядке, в котором были перечислены
его вложения. Ограничение (векторность) состоит в том, что все вложения
имеют один и тот же тип данных, указанный перед перечислением имён вложений.

Динамические атрибуты классов объявляются с префиксом `.`. Тип атрибута
указывается перед его именем при объявлении.
Статические атрибуты класса объявляются также как динамические,
но без символа `.`.
При обявлении свойства, ему может быть задано начальное значение после символа "=".

```
MyClass {
	
	// attributes
	float          .x = 2
	float3         .xyz
	float{r, g, b} .rgb
	
	// uniforms
	float           a = 10
	float3          abc
	float3{a, b, c} tri
	
}
```

Перезадать значение статического свойства можно только из статического метода.
Свойства доступны локальному классу просто по имеени, а соседним классам - как
свойство класса или экземпляра, для статических и динамических, соответственно.


Для хранения JS значений, недоступных GPU, следует использовать тип `js`. Свойства
такого типа могут быть только статическими. Они существуют для удобства
организации CPU кода непосредственно внутри JC модуля. Такому свойству уже при
объявлении может быть присвоено любое JS значение.

```
MyClass {
	js hello = 'world'
	js fs    = require('fs')
}
```

Можно создавать свойства-алиасы, при этом дополнительная память не выделяется.
Просто одно физическое свойство становится доступно под несколькими именами.
Такие свойства могут быть удобны при наследовании, когда в дочернем классе
смысловая нагрузка на свойство изменяется. Не требуется указывать тип свойства.
Запись включает лишь новое имя, символ "=" и старое имя.

```
MyClass {
	
	// Declare actual props
	float .x
	float x1
	js hello = 'world'
	
	// Declare aliases
	.x2    = .x
	x12    = x
	hello2 = hello
	
}
```


### Методы

Методы также подразделяются на динамичесике и статические.

1. Динамические: для каждого экземпляра класса этот метод исполняется в
его контексте данных, обращаясь к динамическим свойствам. Эти
методы могут быть вызваны только из других динамических методов или из статических
методов с использованием операции итерирования.
2. Статические: могут быть вызваны из других статических методов и из
внешних JS модулей. Эти методы могут манипулировать статическими свойствами, а также
использовать операци выделенного итерирования. Основное тело статического метода
выполняется на CPU, поэтому такой метод может использовать статические свойства
и локальные переменные с типом `js`. Для входа в GPU контекст используются операции
выделенного итерирования.

Конструктор класса - особый динамический метод с именем `constructor`. Он вызывается
при использовании оператора `new` в GPU коде. Конструктор не должен возвращать
никаких значений.

```
MyClass {
	
	int .x
	int .y
	
	void .constructor(int _x, int _y) {
		x = _x
		y = _y
	}
	
}
```

В целом методы описываются таким же образом, как и свойства, с разницей в том, что
в их определении присутствует код.

```
MyClass {
	
	float .f1(float x) {
		
	}
	
	float f2(int z) {
		
	}
	
}
```

В качестве параметров динамических методов также могут выступать имена JC классов,
обрамлённые в угловые скобки. Это означает, что в качестве аргумента может быть передан
указанный класс или любой его наследник.

Дабы подытожить логику взаимодействия методов и переменных между собой, можно
рассмотреть следующую таблицу:

|      | .x | .f() | x  | f()  |
| ---- | -- | ---- | -- | ---- |
| .f() | rw | call | r  | no   |
|  f() | i  | i    | rw | call |
|  js  | no | no   | rw | call |

Здесь:
* rw - чтение и запись;
* r - только чтение;
* i - требуется операция итерирования;
* call - прямой вызов функции;
* no - не доступно.

Итого:
* Динамические методы могут только читать статические данные.
* Статические методы могут вызывать друг друга непосредственно и быть вызваны извне.
* Динамические методы могут быть вызваны напрямую только из других динамических методов.
* Из статических методов динамические используются посредством операций итерирования.
* В статическом JS свойстве может лежать JS функция, статический метод может её вызвать.


Как и в случае со свойствами можно создавать алиасы методов.

Дочерним классам доступны все свойства родительских классов так, будто это их
собственные свойства. Если в дочернем классе переопределяется метод,
то внутри него предыдущая версия доступна под именем `super`.


### Итерирование

Операция итерирования предназначена для запуска кернела либо локального цикла
по некоторой коллекции элементов.

1. Выделенное итерирование класса: запускает кернел для итерирования класса.
Итератор может принимать два аргумента: `item` - первый перечисленный аргумент
- указывает на текущий итерируемый элемент. Второй аргумент - системный
номер-идентификатор обрабатываемого элемента. Цикл проходит всквозную все
объекты данного класса. Посещаются только созданные экземпляры.

```
MyClass[](item, idx) {
	item.method();
}
```

2. Выделенное итерирование числа: запускает кернел для итерирования промежутка.
Разница, по сравнению с итерированием класса, состоит в том, что можно указать
произвольное число итериаций. При этом принимается лишь один агрумент, т.к. не
указан класс, относительно которого осуществляется перебор. Однако здесь можно
воспользоваться операцией индексирования класса. Самое же очевидное применение -
для создания больших групп элемнтов через оператор `new`.

```
10000[](idx) {
	// MyClass[idx].method(); // you can, if you dare
	new Something();
}
```

3. Итерирование динамического списка: локальный цикл, проходит все элементы списка.

```
list[](item, idx) {
	
}
```

4. Локальное итерирование числа: аналог цикла for.

```
10[](idx) {
	
}
```

Выделенное итерирование доступно только в статических методах. При написании кода
кернела-итератора можно замыкать данные GPU типа, объявленные выше в теле функции.
Такие данные могут принадлежать только к базовому GPU типу, в т.ч. к векторному.
Для локального итерирования отдельный механизм замыканий не требуется, т.к. это
обычный `for`.


### Динамические списки

В качестве типа GPU свойства может быть указан как JC класс, так и список объектов
такого класса. Такой список динамический и позволяет вставку и удаление элементов.

```
MyClass {
	
	OtherClass[] .friends
	
	.constructor(num) {
		num[]() {
			.friends << new OtherClass(num-1);
		}
	}
	
}
OtherClass {
	
	MyClass[] .friends
	
	.constructor(num) {
		num[]() {
			.friends << new MyClass(num-1);
		}
	}
	
}
```

Операция `<<` используется для добавления в конец такого списка.
Для удаления из списка используется оператор delete с указанием списка и номера
элемента в виде индекса.

```
.list << new Element();
delete .list[0];
```

Если операция удаления производится внутри цикла по этому же списку, то это
повлияет на параметры итератора: следующая итерация будет произведена по ближайшему
существующему непосещённому элементу. В том числе если был удалён текущий
обрабатываемый элемент, то следующий обрабатываемый элемент будет иметь такой же
индекс. Поэтому не следует организовывать операции удаления в циклах так, чтобы
они основывались на индексах, при принятии решения об удалении.
