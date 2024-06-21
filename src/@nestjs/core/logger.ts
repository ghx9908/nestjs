// 从 'cli-color' 模块中导入 clc，用于在终端中输出彩色文字
import clc from 'cli-color';
// 定义一个名为 Logger 的类
class Logger {
  private static lastLogTime = Date.now()
  // 定义一个静态方法 log，该方法接收两个参数：message 和 context
  static log(message: string, context: string = '') {
    // 获取当前日期和时间，并格式化为本地字符串
    const timestamp = new Date().toLocaleString();
    const currentTime = Date.now()
    // 获取当前进程的 PID（进程标识符）
    const pid = process.pid;
    const timeDiff = currentTime - this.lastLogTime
    // 使用 console.log 输出格式化的日志信息
    console.log(
      `${clc.green('[Nest]')} ${clc.green(pid.toString())}  ${clc.green('-')} ${clc.yellow(timestamp)}     ${clc.green('LOG')} ${clc.yellow(`[${context}]`)} ${clc.green(message)}  ${clc.yellow(`+[${timeDiff}]ms`)}`
    );
    this.lastLogTime = currentTime
  }
}
// 导出 Logger 类，以便其他模块可以使用
export { Logger };
