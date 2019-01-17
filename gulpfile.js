/**
 * Created by Quan on 15/11/3.
 */

var gulp        = require('gulp'),
    browserSync = require('browser-sync'),
    reload      = browserSync.reload;

gulp.task('browser-sync', function () {
	browserSync({
		server: {
			baseDir: './'
		}
	});
});

gulp.task('reload', function () {
	gulp.src(['./examples/resize/*.html']).pipe(reload({
		stream: true
	}));
});

gulp.task('watch', function () {
	gulp.watch(['./*.html', './{css,js,res,libs}/*.{css,js,png,jpg}', './examples/resize/**', './*.js'], ['reload']);
});

// 在命令行中运行 gulp，默认执行 default，你也可以自定义其他命令
gulp.task('default', ['browser-sync', 'reload', 'watch']);