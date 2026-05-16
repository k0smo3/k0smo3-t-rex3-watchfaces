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
        const {px} = __$$app$$__.__globals__;
        //const logger = Logger.getLogger('watchface_SashaCX75');
        const logger = DeviceRuntimeCore.HmLogger.getLogger('watchface_SashaCX75')
        //end of ignored block

        //dynamic modify start

        
        let normal_background_bg = ''
        let normal_day_text_font = ''
        let normal_image_img = ''
        let normal_battery_pointer_progress_img_pointer = ''
        let normal_analog_clock_pro_hour_pointer_img = ''
        let normal_analog_clock_time_pointer_hour = ''
        let normal_analog_clock_time_pointer_minute = ''
        let normal_analog_clock_time_pointer_second = ''
        let idle_background_bg = ''
        let idle_day_text_font = ''
        let idle_image_img = ''
        let idle_battery_pointer_progress_img_pointer = ''
        let idle_analog_clock_pro_hour_pointer_img = ''
        let idle_analog_clock_time_pointer_hour = ''
        let idle_analog_clock_time_pointer_minute = ''
        let idle_analog_clock_time_pointer_second = ''
        let image_top_img = ''
        let timeSensor = '';

        let wt_angle_delta = 360 / 24 / 60;
        let wt_current_angle = 0;
        let wt_target_angle = 0;
        let wt_index = 0;
        let worldData = undefined;
        let displayCurrent = true;
        let timer_animate_wt = undefined;
        let timer_second = undefined;
        let world_clock = undefined;

        //dynamic modify end

        __$$module$$__.module = DeviceRuntimeCore.WatchFace({
            init_view() {
                //dynamic modify start
                    
                
            console.log('Watch_Face.ScreenNormal');
            normal_background_bg = hmUI.createWidget(hmUI.widget.FILL_RECT, {
              x: 0,
              y: 0,
              w: 480,
              h: 480,
              color: '0xFFD6D6D6',
              show_level: hmUI.show_level.ONLY_NORMAL,
            });

            if (!timeSensor) timeSensor = hmSensor.createSensor(hmSensor.id.TIME);

            normal_day_text_font = hmUI.createWidget(hmUI.widget.TEXT, {
              x: 322,
              y: 228,
              w: 100,
              h: 30,
              text_size: 28,
              char_space: 0,
              color: 0xFF000000,
              line_space: 0,
              align_v: hmUI.align.CENTER_V,
              text_style: hmUI.text_style.ELLIPSIS,
              align_h: hmUI.align.RIGHT,
              show_level: hmUI.show_level.ONLY_NORMAL,
            });

            normal_image_img = hmUI.createWidget(hmUI.widget.IMG, {
              x: 0,
              y: 0,
              src: 'bck01-ombra.png',
              show_level: hmUI.show_level.ONLY_NORMAL,
            });

            normal_battery_pointer_progress_img_pointer = hmUI.createWidget(hmUI.widget.IMG_POINTER, {
              src: 'ind1-ombra.png',
              center_x: 143,
              center_y: 240,
              x: 14,
              y: 40,
              start_angle: 3,
              end_angle: -188,
              invalid_visible: false,
              type: hmUI.data_type.BATTERY,
              show_level: hmUI.show_level.ONLY_NORMAL,
            });

            const deviceInfo = hmSetting.getDeviceInfo();
            world_clock = hmSensor.createSensor(hmSensor.id.WORLD_CLOCK);
            world_clock.init();
            if (hmFS.SysProGetInt("GS_GMT_wt_index")) wt_index = hmFS.SysProGetInt("GS_GMT_wt_index");

            timeSensor.addEventListener(timeSensor.event.MINUTEEND, function() {
              time_update(false, true);
            });

            timeSensor.addEventListener(timeSensor.event.DAYCHANGE, function() {
              time_update(true);
            });

            // normal_analog_clock_pro_hour_pointer_img = hmUI.createWidget(hmUI.widget.TIME_POINTER_PRO, {
              // src: 'ind-ombra.png',
              // center_x: 240,
              // center_y: 240,
              // x: 101,
              // y: 240,
              // start_angle: 0,
              // end_angle: 360,
              // type: hmUI.data_type.hour,
              // show_level: hmUI.show_level.ONLY_NORMAL,
              // format24h: true,
            // });


            normal_analog_clock_pro_hour_pointer_img = hmUI.createWidget(hmUI.widget.IMG, {
              x: 0,
              y: 0,
              w: deviceInfo.width,
              h: deviceInfo.height,
              pos_x: 240 - 101,
              pos_y: 240 - 240,
              center_x: 240,
              center_y: 240,
              src: 'ind-ombra.png',
              angle: 0,
              show_level: hmUI.show_level.ONLY_NORMAL,
            });

            normal_analog_clock_time_pointer_hour = hmUI.createWidget(hmUI.widget.TIME_POINTER, {
              hour_path: 'ore1-ombra.png',
              hour_centerX: 240,
              hour_centerY: 240,
              hour_posX: 103,
              hour_posY: 240,
              show_level: hmUI.show_level.ONLY_NORMAL,
            });

            normal_analog_clock_time_pointer_minute = hmUI.createWidget(hmUI.widget.TIME_POINTER, {
              minute_path: 'min1-OMBRA.png',
              minute_centerX: 240,
              minute_centerY: 240,
              minute_posX: 103,
              minute_posY: 240,
              show_level: hmUI.show_level.ONLY_NORMAL,
            });

            normal_analog_clock_time_pointer_second = hmUI.createWidget(hmUI.widget.IMG, {
              x: 0,
              y: 0,
              w: deviceInfo.width,
              h: deviceInfo.height,
              pos_x: 240 - 102,
              pos_y: 0,
              center_x: 240,
              center_y: 240,
              src: 'SEC1-ombra.png',
              angle: 0,
              show_level: hmUI.show_level.ONLY_NORMAL,
            });


            console.log('Watch_Face.ScreenAOD');
            idle_background_bg = hmUI.createWidget(hmUI.widget.FILL_RECT, {
              x: 0,
              y: 0,
              w: 480,
              h: 480,
              color: '0xFFD6D6D6',
              show_level: hmUI.show_level.ONLY_AOD,
            });

            idle_day_text_font = hmUI.createWidget(hmUI.widget.TEXT, {
              x: 322,
              y: 228,
              w: 100,
              h: 30,
              text_size: 28,
              char_space: 0,
              color: 0xFF000000,
              line_space: 0,
              align_v: hmUI.align.CENTER_V,
              text_style: hmUI.text_style.ELLIPSIS,
              align_h: hmUI.align.RIGHT,
              show_level: hmUI.show_level.ONLY_AOD,
            });

            idle_image_img = hmUI.createWidget(hmUI.widget.IMG, {
              x: 0,
              y: 0,
              src: 'bck01-ombra.png',
              show_level: hmUI.show_level.ONLY_AOD,
            });

            idle_battery_pointer_progress_img_pointer = hmUI.createWidget(hmUI.widget.IMG_POINTER, {
              src: 'ind1-ombra.png',
              center_x: 143,
              center_y: 240,
              x: 14,
              y: 40,
              start_angle: 3,
              end_angle: -188,
              invalid_visible: false,
              type: hmUI.data_type.BATTERY,
              show_level: hmUI.show_level.ONLY_AOD,
            });

            // idle_analog_clock_pro_hour_pointer_img = hmUI.createWidget(hmUI.widget.TIME_POINTER_PRO, {
              // src: 'ind-ombra.png',
              // center_x: 240,
              // center_y: 240,
              // x: 101,
              // y: 240,
              // start_angle: 0,
              // end_angle: 360,
              // type: hmUI.data_type.hour,
              // show_level: hmUI.show_level.ONLY_AOD,
              // format24h: true,
            // });


            idle_analog_clock_pro_hour_pointer_img = hmUI.createWidget(hmUI.widget.IMG, {
              x: 0,
              y: 0,
              w: deviceInfo.width,
              h: deviceInfo.height,
              pos_x: 240 - 101,
              pos_y: 240 - 240,
              center_x: 240,
              center_y: 240,
              src: 'ind-ombra.png',
              angle: 0,
              show_level: hmUI.show_level.ONLY_AOD,
            });

            idle_analog_clock_time_pointer_hour = hmUI.createWidget(hmUI.widget.TIME_POINTER, {
              hour_path: 'ore1-ombra.png',
              hour_centerX: 240,
              hour_centerY: 240,
              hour_posX: 103,
              hour_posY: 240,
              show_level: hmUI.show_level.ONLY_AOD,
            });

            idle_analog_clock_time_pointer_minute = hmUI.createWidget(hmUI.widget.TIME_POINTER, {
              minute_path: 'min1-OMBRA.png',
              minute_centerX: 240,
              minute_centerY: 240,
              minute_posX: 103,
              minute_posY: 240,
              show_level: hmUI.show_level.ONLY_AOD,
            });

            idle_analog_clock_time_pointer_second = hmUI.createWidget(hmUI.widget.TIME_POINTER, {
              second_path: 'SEC1-ombra.png',
              second_centerX: 240,
              second_centerY: 240,
              second_posX: 102,
              second_posY: 240,
              show_level: hmUI.show_level.ONLY_AOD,
            });

            image_top_img = hmUI.createWidget(hmUI.widget.IMG, {
              x: 0,
              y: 0,
              src: 'ombra1.png',
              show_level: hmUI.show_level.ONLY_NORMAL | hmUI.show_level.ONLY_AOD,
            });

            hmUI.createWidget(hmUI.widget.BUTTON, {
              x: 145,
              y: 283,
              w: 195,
              h: 75,
              text: "",
              normal_src: "_empty.png",
              press_src: "_empty.png",
              show_level: hmUI.show_level.ONLY_NORMAL,
              click_func: () => {
                displayCurrent = gmtButtonClick(displayCurrent);
              },
            });

            let screenType = hmSetting.getScreenType();
            //#region time_update
            function time_update(updateHour = false, updateMinute = false) {
              let hour = timeSensor.hour;
              let minute = timeSensor.minute;

              if (updateHour) {
                let dayStr = timeSensor.day.toString();
                normal_day_text_font.setProperty(hmUI.prop.TEXT, dayStr);
                idle_day_text_font.setProperty(hmUI.prop.TEXT, dayStr);
              };

              if (updateMinute) {
                let local_angle = 360 * hour / 24 + (360 / 24) * minute / 60;
                worldData = getWorldData(wt_index);
                update_world_clock(false);
                if (idle_analog_clock_pro_hour_pointer_img) idle_analog_clock_pro_hour_pointer_img.setProperty(hmUI.prop.ANGLE, local_angle);
              };
            };

            //#endregion

            // 36,000 bph high-beat: 10 steps/sec, 100ms timer
            let last_beat = -1;
            function update_second() {
              const beat = Math.floor((timeSensor.utc % 1000) / 100);
              if (beat === last_beat) return;
              last_beat = beat;
              const angle = (timeSensor.second + beat / 10) / 60 * 360;
              if (normal_analog_clock_time_pointer_second)
                normal_analog_clock_time_pointer_second.setProperty(hmUI.prop.ANGLE, angle);
            }
            timer_second = timer.createTimer(0, 100, update_second);

            function gmtButtonClick(dc) {
              const count = world_clock.getWorldClockCount();
              if (count === 0) {
                hmUI.showToast({ text: "No world clocks set" });
                return true;
              }
              if (dc) {
                worldData = getWorldData(wt_index);
                if (worldData) hmUI.showToast({ text: worldData.city + " (" + (wt_index + 1) + "/" + count + ")" });
                update_world_clock();
                return false;
              }
              wt_index++;
              if (wt_index >= count) wt_index = 0;
              hmFS.SysProSetInt("GS_GMT_wt_index", wt_index);
              worldData = getWorldData(wt_index);
              if (worldData) hmUI.showToast({ text: worldData.city + " (" + (wt_index + 1) + "/" + count + ")" });
              update_world_clock();
              return false;
            }

            function getWorldData(idx) {
              const count = world_clock.getWorldClockCount();
              if (count === 0) return undefined;
              if (idx >= count) idx = 0;
              return world_clock.getWorldClockInfo(idx);
            }

            function update_world_clock(animate = true) {
              if (!worldData) return;
              wt_target_angle = (worldData.hour * 60 + worldData.minute) * wt_angle_delta;
              if (animate) {
                if (!timer_animate_wt) {
                  timer_animate_wt = timer.createTimer(0, 60, function() { animate_wt(); });
                }
              } else {
                wt_current_angle = wt_target_angle;
                set_wt(wt_target_angle);
              }
            }

            function animate_wt() {
              let da = wt_current_angle > wt_target_angle ? -7.4 : 7.4;
              wt_current_angle += da;
              if (wt_current_angle >= 360) wt_current_angle -= 360;
              if (Math.abs(wt_current_angle - wt_target_angle) <= 8) wt_current_angle = wt_target_angle;
              set_wt(wt_current_angle);
              if (timer_animate_wt && wt_current_angle === wt_target_angle) {
                timer.stopTimer(timer_animate_wt);
                timer_animate_wt = undefined;
              }
            }

            function set_wt(angle) {
              if (normal_analog_clock_pro_hour_pointer_img) normal_analog_clock_pro_hour_pointer_img.setProperty(hmUI.prop.ANGLE, angle);
            }

            const widgetDelegate = hmUI.createWidget(hmUI.widget.WIDGET_DELEGATE, {
              resume_call: (function () {
                console.log('resume_call()');
                displayCurrent = true;
                time_update(true, true);
                if (!timer_second) {
                  last_beat = -1;
                  timer_second = timer.createTimer(0, 100, update_second);
              }
              }),
              pause_call: (function () {
                displayCurrent = true;
                if (timer_animate_wt) {
                  timer.stopTimer(timer_animate_wt);
                  timer_animate_wt = undefined;
                }
                if (timer_second) {
                  timer.stopTimer(timer_second);
                  timer_second = undefined;
                }
              }),
            });

                //dynamic modify end
            },
            onInit() {
                logger.log('index page.js on init invoke');
            },
            build() {
                this.init_view();
                logger.log('index page.js on ready invoke');
            },
            onDestroy() {
                logger.log('index page.js on destroy invoke');
            }
        });
        ;
    })();
} catch (e) {
    console.log('Mini Program Error', e);
    e && e.stack && e.stack.split(/\n/).forEach(i => console.log('error stack', i));
    ;
}
