
document.addEventListener("DOMContentLoaded", function () {
    $("#header").load("../user/header.html", function (res, status, xhr) {
    console.log("HEADER LOAD STATUS:", status);
});

    $("#header").load("../user/header.html", function () {
        // Sau khi đã load xong HTML thì mới load và chạy JS
        $.getScript("../../fetch/header.js");
    });

    $("#sidebar").load("../user/sidebar.html", function () {
        $.getScript("../../fetch/sidebar.js");
    });
});




//     // Xử lý gửi bình luận
//     const commentSubmitButton = document.getElementById('comment-submit');
//     if (commentSubmitButton) {
//         commentSubmitButton.addEventListener('click', function () {
//             const commentInput = document.getElementById('comment-input');
//             const commentText = commentInput.value.trim();

//             if (commentText) {
//                 const commentSection = document.querySelector('.comments');
//                 const newComment = document.createElement('div');
//                 newComment.className = 'comment-item';
//                 newComment.innerHTML = `
//                     <p><strong>Người dùng:</strong> ${commentText}</p>
//                     <span class="timestamp">Vừa xong</span>
//                 `;
//                 commentSection.appendChild(newComment);
//                 commentInput.value = ''; // Xóa nội dung trong ô nhập
//             } else {
//                 alert('Vui lòng nhập bình luận!');
//             }
//         });
//     }

//     // Xử lý tìm kiếm bài học
//     const searchButton = document.getElementById('search-button');
//     if (searchButton) {
//         searchButton.addEventListener('click', function () {
//             const searchText = document.getElementById('search-input').value.toLowerCase();
//             const lessons = document.querySelectorAll('.lesson-item');

//             lessons.forEach(lesson => {
//                 const lessonName = lesson.querySelector('.lesson-name').textContent.toLowerCase();
//                 if (lessonName.includes(searchText)) {
//                     lesson.style.display = 'flex';
//                 } else {
//                     lesson.style.display = 'none';
//                 }
//             });
//         });
//     }
// });

// Hàm hiển thị/ẩn link bài học
function toggleLesson(id) {
    const lessonLink = document.getElementById(`lesson-${id}`);
    if (lessonLink.style.display === "none" || lessonLink.style.display === "") {
        lessonLink.style.display = "block"; // Hiển thị link
    } else {
        lessonLink.style.display = "none"; // Ẩn link
    }
}
