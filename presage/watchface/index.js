/*
 ** Watch_Face_Editor tool
 ** watchface js version v2.1.1
 ** Copyright © SashaCX75. All Rights Reserved
 */

try {
  (() => {
    //start of ignored block
    const __$$app$$__ = __$$hmAppManager$$__.currentApp;
    function getApp() {
      return __$$app$$__.app;
    }
    function getCurrentPage() {
      return __$$app$$__.current && __$$app$$__.current.module;
    }
    const __$$module$$__ = __$$app$$__.current;
    const h = new DeviceRuntimeCore.WidgetFactory(new DeviceRuntimeCore.HmDomApi(__$$app$$__, __$$module$$__));
    const { px } = __$$app$$__.__globals__;
    const logger = Logger.getLogger("watchface_SashaCX75");
    //end of ignored block

    //dynamic modify start

    // meta-widget class
    // aggregates normal watchface UI widgets into single object
    class MetaWidget {
      constructor(visible = true) {
        this.visible = visible;
        this.components = new Map();
      }

      show() {
        this.visible = true;
        this.draw();
      }

      hide() {
        this.visible = false;
        this.draw();
      }

      addComponent(key, component) {
        this.components.set(key, component);
        this.draw();
      }

      draw() {
        this.components.forEach((comp) => {
          comp.setProperty(hmUI.prop.VISIBLE, this.visible);
        });
      }
    }

    class ImgWidget {
      constructor(data) {
        this._widget = hmUI.createWidget(hmUI.widget.IMG, data);

        this._angle = data.angle;
        this._visible = true;
      }

      get angle() {
        return this._angle;
      }
      set angle(value) {
        if (this._widget) {
          this._angle = value;
          this._widget.setProperty(hmUI.prop.ANGLE, this._angle);
        }
      }

      get visible() {
        return this._visible;
      }
      set visible(value) {
        if (this._widget) {
          this._visible = value;
          this._widget.setProperty(hmUI.prop.VISIBLE, this._visible);
        }
      }
    }

    // right sub-dial widgets
    let date = new MetaWidget(false);
    let day_of_week = new MetaWidget(false);
    let heart = new MetaWidget(false);
    let steps = new MetaWidget(false);

    let normal_background_bg_img = "";
    let normal_battery_pointer_progress_img_pointer = "";
    let normal_step_icon_img = "";
    let normal_step_pointer_progress_img_pointer = "";
    let normal_heart_rate_icon_img = "";
    let normal_heart_rate_pointer_progress_img_pointer = "";
    let normal_week_pointer_progress_date_pointer = "";
    let normal_week__icon_img = "";
    let normal_day_pointer_progress_date_pointer = "";
    let normal_analog_clock_pro_hour_pointer_img = "";
    let normal_analog_clock_pro_minute_pointer_img = "";
    let normal_analog_clock_pro_second_pointer_img = "";
    let normal_world_clock_pointer_img = "";
    let normal_analog_clock_pro_second_cover_pointer_img = "";
    let idle_background_bg_img = "";
    let idle_analog_clock_time_pointer_hour = "";
    let idle_analog_clock_time_pointer_minute = "";
    let idle_world_clock_pointer_img = "";
    let timeSensor = "";

    let wt_angle_delta = 360 / 24 / 60;
    let wt_current_angle = 0;
    let wt_target_angle = 0;
    let index = 0;
    let worldData = undefined;
    let displayCurrent = true;

    let normal_timerUpdate = undefined;
    let normal_timerUpdateSecSmooth = undefined;
    let timer_animate_wt = undefined;

    const MODE_DATE = 0;
    const MODE_DAY = 1;
    const MODE_STEPS = 2;
    const MODE_PULSE = 3;

    const MODES_COUNT = 4;
    let currentMode = 0;

    let backgrounds = ["normal_bg_black.png", "normal_bg_blue.png", "normal_bg_green.png", "normal_bg_red.png"];
    let current_bg = 0;
    //dynamic modify end

    __$$module$$__.module = DeviceRuntimeCore.WatchFace({
      init_view() {
        //dynamic modify start

        if (hmFS.SysProGetInt("PRESAGE_GMT_current_bg")) current_bg = hmFS.SysProGetInt("PRESAGE_GMT_current_bg");

        normal_background_bg_img = hmUI.createWidget(hmUI.widget.IMG, {
          x: 0,
          y: 0,
          w: 480,
          h: 480,
          src: backgrounds[current_bg],
          show_level: hmUI.show_level.ONLY_NORMAL,
        });

        normal_battery_pointer_progress_img_pointer = hmUI.createWidget(hmUI.widget.IMG_POINTER, {
          src: "normal_mini_handle.png",
          center_x: 117,
          center_y: 207,
          x: 19,
          y: 54,
          start_angle: -180,
          end_angle: -284,
          type: hmUI.data_type.BATTERY,
          show_level: hmUI.show_level.ONLY_NORMAL,
        });

        normal_step_icon_img = hmUI.createWidget(hmUI.widget.IMG, {
          x: 173,
          y: 273,
          src: "scale_steps.png",
          show_level: hmUI.show_level.ONLY_NORMAL,
        });
        normal_step_pointer_progress_img_pointer = hmUI.createWidget(hmUI.widget.IMG_POINTER, {
          src: "normal_mini_handle.png",
          center_x: 240,
          center_y: 341,
          x: 19,
          y: 54,
          start_angle: -120,
          end_angle: 120,
          type: hmUI.data_type.STEP,
          show_level: hmUI.show_level.ONLY_NORMAL,
        });
        steps.addComponent("scale", normal_step_icon_img);
        steps.addComponent("pointer", normal_step_pointer_progress_img_pointer);

        normal_heart_rate_icon_img = hmUI.createWidget(hmUI.widget.IMG, {
          x: 173,
          y: 273,
          src: "scale_heart.png",
          show_level: hmUI.show_level.ONLY_NORMAL,
        });
        normal_heart_rate_pointer_progress_img_pointer = hmUI.createWidget(hmUI.widget.IMG_POINTER, {
          src: "normal_mini_handle.png",
          center_x: 240,
          center_y: 341,
          x: 19,
          y: 54,
          start_angle: -140,
          end_angle: 100,
          type: hmUI.data_type.HEART,
          show_level: hmUI.show_level.ONLY_NORMAL,
        });
        heart.addComponent("scale", normal_heart_rate_icon_img);
        heart.addComponent("pointer", normal_heart_rate_pointer_progress_img_pointer);

        normal_week__icon_img = hmUI.createWidget(hmUI.widget.IMG, {
          x: 173,
          y: 273,
          src: "scale_day.png",
          show_level: hmUI.show_level.ONLY_NORMAL,
        });
        normal_week_pointer_progress_date_pointer = hmUI.createWidget(hmUI.widget.IMG, {
          x: 186,
          y: 288,
          w: 108,
          h: 108,
          pos_x: 108 / 2 - 19,
          pos_y: 0,
          center_x: 108 / 2,
          center_y: 108 / 2,
          angle: 0,
          src: "normal_mini_handle.png",
          show_level: hmUI.show_level.ONLY_NORMAL,
        });
        day_of_week.addComponent("scale", normal_week__icon_img);
        day_of_week.addComponent("pointer", normal_week_pointer_progress_date_pointer);

        normal_day_icon_img = hmUI.createWidget(hmUI.widget.IMG, {
          x: 173,
          y: 273,
          src: "scale_date.png",
          show_level: hmUI.show_level.ONLY_NORMAL,
        });
        normal_day_pointer_progress_date_pointer = hmUI.createWidget(hmUI.widget.IMG, {
          x: 186,
          y: 288,
          w: 108,
          h: 108,
          pos_x: 108 / 2 - 19,
          pos_y: 0,
          center_x: 108 / 2,
          center_y: 108 / 2,
          angle: 0,
          src: "normal_mini_handle.png",
          show_level: hmUI.show_level.ONLY_NORMAL,
        });
        date.addComponent("scale", normal_day_icon_img);
        date.addComponent("pointer", normal_day_pointer_progress_date_pointer);

        const world_clock = hmSensor.createSensor(hmSensor.id.WORLD_CLOCK);
        world_clock.init();
        if (hmFS.SysProGetInt("PRESAGE_GMT_wt_index")) index = hmFS.SysProGetInt("PRESAGE_GMT_wt_index");

        const deviceInfo = hmSetting.getDeviceInfo();
        let screenType = hmSetting.getScreenType();

        let lastDay = 0;
        if (!timeSensor) timeSensor = hmSensor.createSensor(hmSensor.id.TIME);
        timeSensor.addEventListener(timeSensor.event.MINUTEEND, function () {
          time_update(true, true);
          if (lastDay != timeSensor.day) {
            // update on date change only
            lastDay = timeSensor.day;
            dayOfWeek_update();
            date_update();
          }
        });

        normal_world_clock_pointer_img = new ImgWidget({
          x: 0,
          y: 0,
          w: deviceInfo.width,
          h: deviceInfo.height,
          pos_x: 240 - 21,
          pos_y: 240 - 240,
          center_x: 240,
          center_y: 240,
          src: "normal_gmt.png",
          angle: 0,
          show_level: hmUI.show_level.ONLY_NORMAL,
        });

        normal_analog_clock_pro_hour_pointer_img = new ImgWidget({
          x: 0,
          y: 0,
          w: deviceInfo.width,
          h: deviceInfo.height,
          pos_x: 240 - 26,
          pos_y: 240 - 240,
          center_x: 240,
          center_y: 240,
          src: "normal_hours.png",
          angle: 0,
          show_level: hmUI.show_level.ONLY_NORMAL,
        });

        normal_analog_clock_pro_minute_pointer_img = new ImgWidget({
          x: 0,
          y: 0,
          w: deviceInfo.width,
          h: deviceInfo.height,
          pos_x: 240 - 25,
          pos_y: 240 - 240,
          center_x: 240,
          center_y: 240,
          src: "normal_minutes.png",
          angle: 0,
          show_level: hmUI.show_level.ONLY_NORMAL,
        });

        normal_analog_clock_pro_second_pointer_img = new ImgWidget({
          x: 0,
          y: 0,
          w: deviceInfo.width,
          h: deviceInfo.height,
          pos_x: 240 - 23,
          pos_y: 240 - 240,
          center_x: 240,
          center_y: 240,
          src: "normal_seconds.png",
          angle: 0,
          show_level: hmUI.show_level.ONLY_NORMAL,
        });

        normal_analog_clock_pro_second_cover_pointer_img = hmUI.createWidget(hmUI.widget.IMG, {
          x: 235,
          y: 235,
          src: "normal_center.png",
          show_level: hmUI.show_level.ONLY_NORMAL,
        });

        idle_background_bg_img = hmUI.createWidget(hmUI.widget.IMG, {
          x: 0,
          y: 0,
          w: 480,
          h: 480,
          src: "idle_bg.png",
          show_level: hmUI.show_level.ONLY_AOD,
        });

        idle_world_clock_pointer_img = new ImgWidget({
          x: 0,
          y: 0,
          w: deviceInfo.width,
          h: deviceInfo.height,
          pos_x: 240 - 21,
          pos_y: 240 - 240,
          center_x: 240,
          center_y: 240,
          src: "idle_gmt.png",
          angle: 0,
          show_level: hmUI.show_level.ONLY_AOD,
        });

        idle_analog_clock_time_pointer_hour = new ImgWidget({
          x: 0,
          y: 0,
          w: deviceInfo.width,
          h: deviceInfo.height,
          pos_x: 240 - 26,
          pos_y: 240 - 240,
          center_x: 240,
          center_y: 240,
          src: "idle_hours.png",
          angle: 0,
          show_level: hmUI.show_level.ONLY_AOD,
        });

        idle_analog_clock_time_pointer_minute = new ImgWidget({
          x: 0,
          y: 0,
          w: deviceInfo.width,
          h: deviceInfo.height,
          pos_x: 240 - 25,
          pos_y: 240 - 240,
          center_x: 240,
          center_y: 240,
          src: "idle_minutes.png",
          angle: 0,
          show_level: hmUI.show_level.ONLY_AOD,
        });

        let gmtButton = hmUI.createWidget(hmUI.widget.BUTTON, {
          x: 304, // x coordinate of the button
          y: 227, // y coordinate of the button
          text: "",
          w: 70, // button width
          h: 63, // button height
          normal_src: "_empty.png", // transparent image
          press_src: "_empty.png", // transparent image
          show_level: hmUI.show_level.ONLY_NORMAL,
          click_func: () => {
            displayCurrent = gmtButtonClick(displayCurrent);
          },
        });

        let logoButton = hmUI.createWidget(hmUI.widget.BUTTON, {
          x: 185, // x coordinate of the button
          y: 53, // y coordinate of the button
          text: "",
          w: 106, // button width
          h: 106, // button height
          normal_src: "_empty.png", // transparent image
          press_src: "_empty.png", // transparent image
          show_level: hmUI.show_level.ONLY_NORMAL,
          click_func: () => {
            switchBg();
          },
        });

        function switchBg() {
          current_bg++;
          if (current_bg >= backgrounds.length) current_bg = 0;

          hmFS.SysProSetInt("PRESAGE_GMT_current_bg", current_bg);
          normal_background_bg_img.setProperty(hmUI.prop.SRC, backgrounds[current_bg]);
        }

        let bottomSubDialButton = hmUI.createWidget(hmUI.widget.BUTTON, {
          x: 185, // x coordinate of the button
          y: 288, // y coordinate of the button
          text: "",
          w: 106, // button width
          h: 106, // button height
          normal_src: "_empty.png", // transparent image
          press_src: "_empty.png", // transparent image
          show_level: hmUI.show_level.ONLY_NORMAL,
          click_func: () => {
            bottomSubDialClick();
          },
        });

        if (hmFS.SysProGetInt("PRESAGE_GMT_currentMode")) currentMode = hmFS.SysProGetInt("PRESAGE_GMT_currentMode");
        bottomSubDialUpdate(false);

        function time_update(updateHour = false, updateMinute = false) {
          let hour = timeSensor.hour;
          let minute = timeSensor.minute;
          let second = timeSensor.second;

          if (updateHour) {
            let normal_hour = hour;
            let normal_fullAngle_hour = 360;
            if (normal_hour > 11) normal_hour -= 12;
            let normal_angle_hour = 0 + (normal_fullAngle_hour * normal_hour) / 12 + ((normal_fullAngle_hour / 12) * minute) / 60;

            normal_analog_clock_pro_hour_pointer_img.angle = normal_angle_hour;
            idle_analog_clock_time_pointer_hour.angle = normal_angle_hour;
          }

          if (updateMinute) {
            let normal_fullAngle_minute = 360;
            let normal_angle_minute = (normal_fullAngle_minute / 60 / 60) * (minute * 60 + second);

            normal_analog_clock_pro_minute_pointer_img.angle = normal_angle_minute;
            idle_analog_clock_time_pointer_minute.angle = normal_angle_minute;

            // gmt
            worldData = getWorldData(index);
            update_world_clock(false);
          }
        }

        function time_update_sec_smth() {
          const second = timeSensor.second;
          const second_angle = 0 + (360 * (second + (timeSensor.utc % 1000) / 1000)) / 60;

          normal_analog_clock_pro_second_pointer_img.angle = second_angle;
        }

        function gmtButtonClick(displayCurrent) {
          const count = world_clock.getWorldClockCount();

          if (displayCurrent) {
            worldData = getWorldData(index);
            hmUI.showToast({ text: worldData.city + " (" + (index + 1) + "/" + count + ")" });
            return false;
          }

          index++;
          if (index == count) index = 0;

          hmFS.SysProSetInt("PRESAGE_GMT_wt_index", index);

          worldData = getWorldData(index);
          if (worldData) hmUI.showToast({ text: worldData.city + " (" + (index + 1) + "/" + count + ")" });
          update_world_clock();
        }

        function getWorldData(idx) {
          let count = world_clock.getWorldClockCount();
          let data = undefined;

          if (idx >= count) idx = 0;
          if (count > 0 && idx < count) data = world_clock.getWorldClockInfo(idx);

          return data;
        }

        function update_world_clock(animate = true) {
          if (worldData) {
            normal_world_clock_pointer_img.visible = true;
            idle_world_clock_pointer_img.visible = true;
            wt_target_angle = (worldData.hour * 60 + worldData.minute) * wt_angle_delta;

            if (animate) {
              if (!timer_animate_wt) {
                timer_animate_wt = timer.createTimer(0, 30, function (option) {
                  animate_wt();
                });
              }
            } else {
              wt_current_angle = wt_target_angle;
              set_wt(wt_target_angle);
            }
          } else {
            normal_world_clock_pointer_img.visible = false;
            idle_world_clock_pointer_img.visible = false;
          }
        }

        function getDayOfWeekNormalAngle() {
          let week = timeSensor.week;
          return (360 / 7) * (week - 1);
        }

        function getDateNormalAngle() {
          let date = timeSensor.day;
          return (360 / 31) * (date - 1);
        }

        function dayOfWeek_update() {
          let weekAngle = getDayOfWeekNormalAngle();
          if (day_of_week.components.get("pointer")) day_of_week.components.get("pointer").setProperty(hmUI.prop.ANGLE, weekAngle);
        }

        function date_update() {
          let weekAngle = getDateNormalAngle();
          if (date.components.get("pointer")) date.components.get("pointer").setProperty(hmUI.prop.ANGLE, weekAngle);
        }

        function valuesAreClose(firstValue, secondValue, tolerance = 10) {
          return Math.abs(firstValue - secondValue) <= tolerance;
        }

        function animate_wt() {
          let da = wt_current_angle > wt_target_angle ? -3 : 3;
          wt_current_angle += da;
          if (wt_current_angle >= 360) wt_current_angle = wt_current_angle - 360;
          if (valuesAreClose(wt_current_angle, wt_target_angle, 4)) wt_current_angle = wt_target_angle;

          set_wt(wt_current_angle);

          if (timer_animate_wt && wt_current_angle == wt_target_angle) {
            timer.stopTimer(timer_animate_wt);
            timer_animate_wt = undefined;
          }
        }

        function set_wt(angle) {
          normal_world_clock_pointer_img.angle = angle;
          idle_world_clock_pointer_img.angle = angle;
        }

        function bottomSubDialClick() {
          // switch sub-dial functions
          currentMode++;
          if (currentMode >= MODES_COUNT) currentMode = 0;
          hmFS.SysProSetInt("PRESAGE_GMT_currentMode", currentMode);

          bottomSubDialUpdate();
        }

        function bottomSubDialUpdate(showToast = true) {
          switch (currentMode) {
            case MODE_DATE:
              heart.hide();
              date.show();
              if (showToast) hmUI.showToast({ text: "Date" });
              break;
            case MODE_DAY:
              date.hide();
              day_of_week.show();
              if (showToast) hmUI.showToast({ text: "Day of week" });
              break;
            case MODE_STEPS:
              day_of_week.hide();
              steps.show();
              if (showToast) hmUI.showToast({ text: "Steps" });
              break;
            case MODE_PULSE:
              steps.hide();
              heart.show();
              if (showToast) hmUI.showToast({ text: "Heart" });
              break;
          }
        }

        const widgetDelegate = hmUI.createWidget(hmUI.widget.WIDGET_DELEGATE, {
          resume_call: function () {
            displayCurrent = true;
            worldData = getWorldData(index);
            time_update(true, true);

            if (screenType == hmSetting.screen_type.WATCHFACE) {
              if (!normal_timerUpdate) {
                let animDelay = timeSensor.utc % 1000;
                let animRepeat = (1000 * 60) / 6;
                normal_timerUpdate = timer.createTimer(animDelay, animRepeat, function (option) {
                  time_update(false, true);
                }); // end timer
              } // end timer check
            } // end screenType

            if (screenType == hmSetting.screen_type.WATCHFACE) {
              if (!normal_timerUpdateSecSmooth) {
                let animDelay = 0;
                let animRepeat = 1000 / 6;
                normal_timerUpdateSecSmooth = timer.createTimer(animDelay, animRepeat, function (option) {
                  time_update_sec_smth();
                }); // end timer
              } // end timer check
            } // end screenType
          },
          pause_call: function () {
            displayCurrent = true;

            if (normal_timerUpdate) {
              timer.stopTimer(normal_timerUpdate);
              normal_timerUpdate = undefined;
            }
            if (normal_timerUpdateSecSmooth) {
              timer.stopTimer(normal_timerUpdateSecSmooth);
              normal_timerUpdateSecSmooth = undefined;
            }
          },
        });

        //dynamic modify end
      },
      onInit() {
        logger.log("index page.js on init invoke");
      },
      build() {
        this.init_view();
        logger.log("index page.js on ready invoke");
      },
      onDestroy() {
        logger.log("index page.js on destroy invoke");
      },
    });
  })();
} catch (e) {
  console.log("Mini Program Error", e);
  e && e.stack && e.stack.split(/\n/).forEach((i) => console.log("error stack", i));
}
