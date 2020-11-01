import { addTopic } from '~/ajax/topic';

document.getElementById('go').addEventListener('click', uploadType);

if (localStorage.getItem('lesson') != null) {
    document.getElementById('lesson').value = localStorage.getItem('lesson');
}
if (localStorage.getItem('part') != null) {
    document.getElementById('part').value = localStorage.getItem('part');
}
if (localStorage.getItem('type') != null) {
    document.getElementById('type').value = localStorage.getItem('type');
}
function gvalue(id) {
    return document.getElementById(id).value;
}
function uploadType() {
    let lesson = gvalue('lesson');
    let part = gvalue('part');
    let type = gvalue('type');
    let title = gvalue('title');
    let choice1 = gvalue('choice1');
    let choice2 = gvalue('choice2');
    let answer = gvalue('answer');
    let choice = `['${choice1}','${choice2}']`;
    if (lesson != '' && part != '') {
        addTopic(title, type, choice, answer, lesson, part).then((res) => {
            if (res.code == 0) {
                alert('上传成功');
                location.reload();
            }
        });
    }
}