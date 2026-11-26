/*
 * Display Sensei v1.0.0
 * Built by build.js from src/, lang/ and icon.png. Edit those, not this file.
 *
 * Copyright (c) 2026 HMC Studios
 * MIT License, see the LICENSE file.
 */
(function() {
'use strict';

// ---- src/meta.js ----

// =========================
// Plugin metadata
// =========================
const PLUGIN_ID = 'display_sensei';

const PLUGIN_META = {
    title: 'Display Sensei',
    author: 'NET',
    icon: 'icon.png',
    description: 'Edit and preview how Bedrock blocks display (held, in item frames, on the ground, in the GUI, on the head, in flower pots and on shelves), how 3D items sit in the hand, and how armor fits on players and mobs.',
    tags: ['Minecraft: Bedrock Edition', 'Utility'],
    version: '1.0.0',
    min_version: '5.2.0',
    variant: 'both',
    creation_date: '2026-10-03',
    repository: 'https://github.com/HMC-Studios/Display-Sensei',
    bug_tracker: 'https://github.com/HMC-Studios/Display-Sensei/issues'
};

const PANEL_ICON = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgCAMAAADVRocKAAAC91BMVEUBAQIDCQgMEAcUGAcZHgIXHAsfJAoaHwsgGgkRGBQbDwIhJgsiJwsjJwwkKAwjKAwlKQwlKQ0iJw4jKA4kKQ4kKQ8kJyMqEwE5GwEvJA4wHQQ/IgNRIwYmKw0oLQ4qLw49KgpFMAxIKANOLARTLwQrMA8tMhAuMxAwNREyMxFPNg0yNh0tMyoyODE5PTZMOxZDRy48QTg/QzxEST5GUENHUkQ4P0NJU0ZIU0ZMUEhJVEVIU0VKVUZMV0hPWkpSXU1ZMgRhLAleNgZjOQZePg9qPgdoQgxrMwx5OA5yRQt6TQ6DPBCLQRKFVhGRRROZVgCWRhSRXBKUWwyUYhKfXg6icQ+raRKwbRNZQxlaXklUX09VYFBWYVFXYlJYY1RpRhNvTBd5RRV7WRp2UhqDUhx+XCJiTyV1ZjKFZSZbZlZlaFJnUzp0ZjxeaFlnc2FqdmRvcl+GdF9teGZ2eXmaSBaNXRSOXh+SZhqUZSOfaRecaiijbxiQci2kbyercxuodCy1cRW6cxW2dBm+eBe7ehyudyukgR2xfRGueyCwei21fi+wlCq8fh67gS7DfRrDgx9wfGuKe0WffzqhiUSGeUd4hHJzfm23gTKrgjawijyukUSrm1u8gzDBiTXIjTbAqj/DoU29l2e6rGKBjXqMl4SXoo/Khh7SjBnQjiPXlCTamSjimyTNoCrenirkoyzMkznTmTvNmD7doD3WnkDjpkHco0LSoEbcpUfKoknGnmfjrR7apDDspSnmpi7oqjHsrzPquinwtDf0uTj0uzvxwCX2vjj2vj38wyj7wj35wj/+vTf2zTr+2DrRuFHfq0njqkTmrUfrtEzxu1D7xED1vlL2yEr8x0L3zkr/00v/4kTbwWDtwlfzwFf7xVbwylr9y1z/1WD34mf/2Wfu6oL/7W7/9X6gq5insZ+stqSyvKq6xLHByrnEzr3H0b7J0cLhx6Lr6pvJ08Hu7ar8+aHL0cXO18bT3MzZ4dHd59Th6tno7+Hv9Or6+/ZC5SmnAAATnElEQVR42q2aaXQb13WAZwAShLHDSQ0KwAAgFlKlmypupNjmAoAA98WxI5t0sFFLnEhpKSVKZVtSZMmSvCkKqbYBlbai0hYABZImrcVKWmszKVuWkzgiRVVO4ihq03hmAJJqmXABQPzoue/NDEBaOSc/fA85GMy8ud+7775t7gWRXVrKLsF/NpNKpVLpVGYJyVQymaBpOjkznS8zMzMz04uZTHpmej6dTmcyqfn5xUw6nVpcTCOBR9FJJpNZSkSjMWJpKZvNZnlAWgBMfxIwNZUPWBAA6T8OiAEAEQCSEopks1kMiCVnZ6ZnZmdnQTE2YHY6vbSUmZ1ZyKQzmaX0/Hwqk4G6ZZCAngwnS0kMyKbm5ufn5+amk1NTM7Mz8/MLc8mpqUQiwcZiMRY+aZpmWTaR5GT67t3pZHJqemrm7iw6AeOmcBXuzs1NT8HXqenpudj2o70AmKYZhqFjNE3TCZAkE4lGGZalY7EY3IqFw5FYLMagmyzDMgzDsNyRxSf4FNSAMPhJ9miVywWAOUYohmo4xUajMbgEWlmWjUUiETAiiQlsIsGdsPwnyyZYfIbVIArD9joDfgDchfoANEajsgk6Eo3SDE1Ho1EoGsUW0PA0y8CjvBZeGVYonNKgjGESvU6fD5x8l0kwW4PBUCgYCG4NhUKhoD8YCAQC/kAgEAwGgwG/zwenoWAwGAqGVkiQexIOgSC6vbU3Eo6ybCJc7fMTmczSNJNgXE6X3+9zuXwgfr/P53O5XD5/AJQL4vL5feiaH7EDQT8u6selXC70vD8YOBrujawA+Jyu6qqqisrKRyoerqp4+OHKynVr166rrMCf69atRbJu3brKyocr4QNKrFsHV5Cs5UqgQo9s690BgN4qn0sAuFz3kSLy0xEizNIMArh8AJiiWRoBPi0hmKXMIji5AgEynz6AzqQWeEA6jQB+l+8+khQVClKEpPBeUrRS8EXurggD5mmaPVrl8xOpdBoD/PeRpFijUGs0Wo1KpRFEpVbDUaVWq1UalQrfojQaiqJMFIWLKNS5BwrzANV+nwDwYYBSqVRrVUqFEj2jUisVIEqlQi6Xy/GHQqFWIw4F+pVKhUJe8I0HJWoVlFZqxAiQBkBvtR910zk2weAmEmuUarVaq1UplWqVSosqjvQr1UqFCtkGFmo1GkqLDdCqVCq1vGDqKwUqFRRSIAvY7NIiAJx+mCqW5hNJ1u/DANCr1arUKjXXTsgauVytVmu0oBlVHInJxDWRquDBbFQMbalWypEFTB4gwwE4C9RaLZUTEzqCXm3+RZMprwyl0Yi/mV2QKPA5VcgDGPYoN5LvooHm5wB5FTSZsCqAqrQU/moyUaZlBI2mIJnNVhcgLg/ILCAn+9BAm6YZoRcpVcsAZqTKZJKISZFIXCTXUCazmWsb0I31V2Sz2YQY7NViAL2Uno/F6ByApQO8k1UU1wJIERJNkYgkSJIgCJIUiQslSgqBUV/VaDSSgmlYcb8iRjRTIdeLMAD5YBqNZAGANZsdDofDbDY7KKR+VfPO+nKLmKOIxEUSNdc+ElEULenpBwvApHzADqc/gFY0mqF5Hyi1JgeW0lKHo7SMKgT1JesPvri/Jz7Q88JzG0qkQMHGFEkk4oIot2lY+LxYQmEAs5RZoNGKFuQBfqcAMPOEsrLPFpIEQZY88eL+A4f6BwYGhy9cuDAUf/W5DSUSEYHl0bksL0uRB8UFCs7Ji7AeOIMhASD0ImyB2VxWej+0iHTTkZPdHQeO9PT0xAeHh0cG4/GBoaGR4firm9Y88MVvT2XzJcN88/M8gAFAIJAD+JYBSs1yEUkQq54bvnzh4vDg4ABIfPDSlbHRSyPDIxdHRkYuDP3of7MrJfGNZQA0krMLbJL1O10CoLS0zFSE1Lf1DMQHQNswyODw5XevXrt2bezy5Usjw8PxI/s7Dv3HYp72uW+uLpAU8usBt2QCIDGV8PEAyuEodRSJCEL09KsD8Z5DPQODwyMXLyLE4ODg4PDFkYtIhgfi/Yfav/Tkvwo7wx2SAoXJzAPwmhzAgGTC5+S6KeUoLbufJO/fcv4nP7k0AqoHoekvXQLGYLy/Pz5y5cro5ZHBwcF4f0/3ofYv7ctg/V8Qo1kkv4mq/TyA5QAUAErvJ8nnRs6fP3/pyuTk1bH33x8bvXTp0uXLo1evXB4ZuXJrcvLW5OTVy4Pxnu4DHR0H2ncjG6oL0AAycyMZrWgYsDTHwHSNehGlNZU6ANB2cH/7rheOxF8f/fAXv/jFrXfHxkavTE5OXrv67rtjo2NXJyfHRkdHL8X7u3va63TfymazDFHqcJhNJgcAYqmFGZpmjlbj6fouAytakAM4EGBn98GO9vb29icPDgyfP3/5yvuT194dG7tyZWzsMvh8cPjiJWimkZFddoOheD6b/RxR5nA4coDZPMAcwzIcwERxgLbu7vUWQ33bkweHBk52dBzoiZ+/fHXy2rVbt65euTgYj8f7+2FgHKm3Wm023beyU4SorLR0OQAvmdxsGuAAYEHZZ6CJ1ssIGK362rY9HS8e3N/e3n6g5/zV//zwFhoJg/GeI/2Hmq1Wu81uM5Rkv80BKN4H89FYbIfTj3cVMZoOuEK8D0oRoLtZ9A+/+pfvfG0VzDv68uYn2vfvb+8eGIj3DJwHh4+Ojr5gN9hsVpvdbi1OfJEQrUYWmLkFZyESjW6DgcYBQj4M0OQA0ombN27/+senf7BljZQgCJHe07xnYOhkR0d7x6GB0SvXN1ltbrcNHQx/fR/fRPw4AMD2fECeBas/Q5LNLzZLxyfePHP8tb5z43d+88E/fX1NIUEQ0vLmtvb9B/d3DwztMtjdbrfN7vZ4bVYDSYrKygQfACAajW13BQNEKpWeohk6lPNB6eo/I8mm9iZx39m+EycOHz9+/PrE7d/+9rcf/fvff20VTNX68vo9Q8O7rHa324MEA2B+N5sd3K4ixTCJcKCrayWAMpWVAaC5o0m8+6USXXnns3uPjU/cuH1z/PrEzYnrZ3/wzNOrRET5hZE9VrvHWycACJHDZIKJsogHsMsAQVeAA6xGgKaOevHel8pluuJig63z2WM/v3nj+plThw/3nR6/c+cfyZKhoT1Wu7fuk4DSojwL/PkA/zLAzu5mcd+JWpnBaDAaiouLjbVfff7wG8eOHz/cN3FzM1HS0/OE1eatqwOGVwCYOQBsWwDg6tqKASwTwusBbqLPkuSuofXSU29u0BlrahpqaoxGoBis5Rue3Y0Alu4jbVabp66uqQkANitJiMwms9nhKCsSlsxE2BkKAWA6D6A1rV4NFjw3tFP6BgI0tDS2tDQ21BiNVotFpzOUHz+3mbAcOiQAvG6720aSItBfWioAmHwAw4S4JuIBu4bWi4+d2qAzNjQ0Nra0tgBD9je//+A7ev3efeUYYEUAr82aA+RZkAcAH2z1BZYBdp7cKT58olZX09jY2toKgBrr9//5Dx9/oLfse6mcsHQfajNY3eABuxUBCJHJbDIvB/TCop9OZ6bzAHw3betvEx/uA0DLYyCtDeUlv//4rd99UGzpO1HLA+rq3Hab1WqzW5EFAiCWXpyJRmM7XPcElHIA6dnrG8CCxx5//LHWVtn3/+83H77937/SW9441UlYDh5oM1i9TXVut91qx70I79ZWF+HZdAqmClcwmANwA81cVgq9aGd/m3T89mZdTYNB72782wbL3/3bH95+55eb1shKAFAe738CXAAAt8eeByjjAVEEyFnADzQAcJPd+M3NuhpDbadU31he8offvf3T89+tlck8Z653EuUXLrzg9tY11dltdn6qMOcGWiy1OM03EXYys5UfaObVZQBo6qiXfnTnGV2Nfs97epnu6//z0Yfv/Oy7MpG+uPbc9Q0wVQCgzmu1CgATAvBOXsRbRwEgDDSzMBdJP/qvZ3Q11vqezbItP/z4rXd+2VmiLzYaO2/c2IQtwLOE3eO126wrAFn0noy2jisB3EgGwA0AtOg6f1b+w5+dfO/1l0tE+oYa48abd54hSgYG91htbq/XZnPX1dmtMJKpXBNhABt2hVYCzALgxSbp2YnNupoWY+3r7+55+a23XyZkhobGRuPGX9/ZRJT09z+BAHZoKA5AmUwOc95cxIZ9W7eiVyg0Xftyk91nsZNhLqppaSyWvvXU+vfq9XpjTeNjjcaNEzc2cwCP1+vxcABSpM01EZ5N2XCoqwu9xuYB0Jp8Pwacvr5Z19AitdQ/dXJ9iV5kaGlpaW00bnxzfDNhAYD9XgB+ugYn84C79waIj73RqdMb9LVP2sqfahbpGltaW1sbjfXnxjcQ5QPx9TzA6+UA1CfWgyAHQGuyAMAbr/428bETtbI1f2570qMn205aRPoGBGhAA21oaFc+ALopcjJeMsHJYIE/B9iaB3AA4GSbuO9EJ/Hdn365SS8jZeWv1BPGx1taAPAGD3C77dBEXqtBzwH4vSmKVTC90IuWAygt5TADoO1kmxS8+fJ7r+hFMqNBf3I9YXu8taXRuPE0bwFs6jxer9tm+BMAIRQvElMqDgDddOL2JqL2ladEsuKGBr2lhDS2tjQ21mw8e7aTsHT37Cw2IIDbajUYiklShOIv9wTMwlTBvYAoKeyD5o566c9vbimRkjICljWrXqeraWloqDE2nD7XSVgO7G8GgN0D64HBAD5QyBUaE/8auwwwT7MsD1AIgCbpibOHv3fsB1vWlBiNRmON0VjT2NBQU9xwDNaDAwcAYHd7PGABcrJSLlfxgKX0AgIEeQCz1cUDHA6+ic6+efjZvRN37kycfu2rDQhSU2M0eA4f4wBo5+V1GwwGK/hAqVTwABxtYXqdwSACMADAr1ByLe+DZnLNluef3zs+cebUufGJn5/etxEWfmOxp6+vlijp72kz2NDWzlpssOpIkhSpFXKVyfQJQDqTQT7gARqH2SwBQHuTQSaSlnzn9PUzp/qOnzh7/dcf/WjfRruu/AZMFfH4egRw260Ggwz0S+RyuZq6ByCduRtj6HyApogkxZamti83eww6QmZ5estrfSdOHD81PvHjc2/s3n3j9mai5GR8PWzc4U8vwvolcrmCWtlEAQDMwDjwCW+ZZlURhCZJUmqx2t1ej0Enk616+vnXzkycee21vS+dGL+JAdCJbHa3AQKZYomkSCKXqzXae1kwkxtoCKBWFBWKcBRYJNbbvE1NXoNMJLNs3vfS9/Y9u/vUmQ2EZf+hNtRN3XpePwJQ1L0A0wgQ4IIhDjMKxMmLxFykWSS1eOrqvDadjJRZ1mzYewZm0/b2JuimNimUKJJjgFKzEhBAgFmaZbo4gFxjNjvMZkqp1mgUksI8iNvjsRt0MlK8Zks5AJqLDTarDMI6EixyiMZp+ZDaYoyzIJVKzzIs2yV0UwhCOUyUVimXK9UKuYRvLVIkNdi9Xo9VJyJkzR0dzcVWg2il/pWAAALMMDCSEUCFACjkRWnVSgjDqtUSobVIsd4K29G6tv0vNhtw88uxfi0XP6SEgNQyALMVB6RUSi1M6ny4DsxAsV55fmsZPN4vHzzYDL2fLFTIJXKJRM6HKLVU/lTBOXkWAXgL0P5MCAhSHAMCyDlDRKvq13cS2L2gXsMX164ABEIo8gtzEZ7s1ADA4UxBKA0KXINIinhDCMhm4OaXK7kYK2UyafngOG8BB2ByFqhMKwS1rBrrl0gAIubcLuaca6KEkhwALZk0c5Sf7GiG6XIGOAB1D4CAwAzsEexeOWXKCxJzgVk2m02vAHBOVqDByMeQuadMXIRULed6DOhFfxKJhspViIKex0ffOQBaD+ZiQhMpJMplkfH8IDWkE3IEjNGg6DLFqacolQJF3wVAAC+ZMFVwALkKHsmP4nOnKAuiUinyEQouhC1URKNRafiYHQbgbgqAatd9BEEW/Aki/qSIeCFRiJugBUCAB3T5Qg888MADf8HJ57D8ZU4eeuihv8LyBZC1a9c++uijj1aDOJ0uly/g51KPW7u6QlOZnAWpdHqehdRxlM5kMunFRZR4h3SzkMrmM9BwhTtBX9C95QI3IVCeQuPgKH7LTM8nk0mGjjGQLU+lVgDgmMHpdFCc5gQVgYx4insCXUstLi6mcJkFlGJBPkjPJ5JJOhajM0uZFQC+XilB5QoA/wD82gB+ELCYWg4IrgAss4AP6Ar15s44DMdOLxPu2Uw6g5NEITyb0gwbi0ZjDIOz6okkm8uhs8lEEjLRfB6cy4ZziWkWC8p28wlvyKHDOcxFfKyCZmJRJDGc2+a+RSORCOTE4TPGJbpx5hyy8JFIOBKNIsWRcCQS7u09GsGcaO/Ro2F+67iIgyGcRi53HovG0JPRKACAhwE5iSICpzAG38LhcG+UMyUcDkf4rSMsmbk60wwkggWT4RKDb+KcvZC258zLA0QQAJsZCYcj+C0zSMzPLyT5IrhGUCbXRBHuZmy5YI0RvlwY6n90RwTVKRYN9/aGIQsFI3n7jh1d1U4nGpLVVehQVVWFj1X4tBod8sSZu1slPALZ+crKispHnC4X/DmdTvgNALFt27bQWrhbUYlT9FzuXsjioy8ogY8y/JUVFegLfxE+KoXiIDB3OJ3VFRUV8BMCYtv2HV2VXB0qKjmpqKqowIrgSwX3j4oI1qESFXABao/qgX9GgOYml7OqqgoBtm/f0VVRLRCw4oqqCoxDRlfiA6ZybQalq/BV9JxgDwfwwY8c4JcU/w8NWcF7qHBYiQAAAABJRU5ErkJggg==';

// ---- src/i18n.js ----

// =========================
// Translations
// =========================
const DS_TRANSLATIONS = {
    "en": {
        "display_sensei.ui.title": "Display Sensei",
        "display_sensei.ui.subtitle": "Bedrock display editor",
        "display_sensei.ui.right_hand": "Right Hand",
        "display_sensei.ui.left_hand": "Left Hand",
        "display_sensei.ui.right": "Right",
        "display_sensei.ui.left": "Left",
        "display_sensei.ui.hand": "Hand",
        "display_sensei.ui.back_camera": "Camera",
        "display_sensei.ui.back_camera_shoulder": "Over shoulder",
        "display_sensei.ui.back_camera_shoulder_hint": "Behind the player, turned slightly towards the holding hand, so a small item is not hidden behind the arm.",
        "display_sensei.ui.back_camera_straight": "Straight behind",
        "display_sensei.ui.back_camera_straight_hint": "Exactly behind the player, like Minecraft's first F5 view. The arm can hide a small item from here.",
        "display_sensei.ui.view": "View",
        "display_sensei.ui.view_toggle_hint": "Show or hide the preview controls of this context. Reset view stays here either way.",
        "display_sensei.ui.preview_only": "Preview only",
        "display_sensei.ui.preview_only_hint": "Nothing in this section is saved in the project or exported. It only changes how Display Mode shows this context.",
        "display_sensei.ui.reset_view": "Reset view",
        "display_sensei.ui.reset_view_hint": "Show this context's camera again, with the item in view, and put the pose angle back where the Bedrock reference starts it (18° for the Bedrock player's arm). Dragging in the viewport orbits the camera and scrolling zooms; this puts it back.",
        "display_sensei.ui.reference_model": "Reference",
        "display_sensei.ui.reference_estimate": "Estimate",
        "display_sensei.ui.reference_estimate_hint": "Where this reference holds the item is an estimate: Bedrock has no data for it in its files, and it is not measured in game yet.",
        "display_sensei.ui.pose_angle": "Pose angle",
        "display_sensei.ui.pose_angle_hint": "Preview only: raises or lowers the Bedrock player's arm (on the Head card, how far it looks up or down), like Blockbench's Pose Angle. The Bedrock arm starts at 18°, where the game holds an item. Not saved and not exported.",
        "display_sensei.ui.preview_animation": "Spin and bob",
        "display_sensei.ui.preview_animation_hint": "Preview only: the dropped item spins and bobs, timed by the clock. The rates are an estimate: no Bedrock file has them, and they are not measured in game yet. Untick it to look at the item standing still.",
        "display_sensei.ui.skin": "Minecraft Skin…",
        "display_sensei.ui.skin_hint": "Preview only: load a skin onto the Bedrock player with Blockbench's own Minecraft Skin dialog: a 64 × 64 skin file, or a player name that Blockbench looks up online (a Bedrock gamertag can't be looked up, so use the skin file). The skin is not saved in the project.",
        "display_sensei.ui.card_title_hand": "{context} · {hand}",
        "display_sensei.ui.card_target_name": "({name})",
        "display_sensei.ui.technical_label": "{key} ({label})",
        "display_sensei.ui.output_block": "Geometry: item_display_transforms",
        "display_sensei.ui.output_block_hint": "Paste it into the geometry object in minecraft:geometry, next to description and bones.",
        "display_sensei.ui.output_attachable": "Attachable and animation files",
        "display_sensei.ui.output_entity": "Mob files",
        "display_sensei.ui.copy": "Copy",
        "display_sensei.ui.export": "Export",
        "display_sensei.ui.state_default": "Bedrock default",
        "display_sensei.ui.state_custom": "Written",
        "display_sensei.ui.state_default_hint": "Left out of the geometry, so the game applies its own default here. The preview shows that default.",
        "display_sensei.ui.state_custom_hint": "Written to item_display_transforms in the geometry, so the game uses these values.",
        "display_sensei.ui.use_default": "Use Bedrock default",
        "display_sensei.ui.use_default_hint": "Leave this context out of the geometry so the game uses its built-in transform. Ticking it puts the Bedrock default values back; changing any value unticks it.",
        "display_sensei.ui.fit_to_frame": "Fit to frame",
        "display_sensei.ui.fit_to_frame_hint": "Scale the item to fit its inventory slot (GUI only). On by default.",
        "display_sensei.ui.translation": "Translation",
        "display_sensei.ui.rotation": "Rotation",
        "display_sensei.ui.scale": "Scale",
        "display_sensei.ui.translation_label": "Translation (pixels)",
        "display_sensei.ui.rotation_label": "Rotation (degrees)",
        "display_sensei.ui.scale_label": "Scale (0 to 4)",
        "display_sensei.ui.step": "Step",
        "display_sensei.ui.step_px": "{step} px",
        "display_sensei.ui.nudge_hint": "Move {axis} by {amount} px. Hold to repeat.",
        "display_sensei.ui.slider_axis": "The slider and the quick values change {axis}",
        "display_sensei.ui.quick_rotation_hint": "Set {axis} to {value}°",
        "display_sensei.ui.uniform_scale": "Keep X, Y and Z equal",
        "display_sensei.ui.uniform_scale_hint": "Typing a scale for one axis, or dragging the slider, sets all three. Untick it to scale one axis at a time; the quick values always set all three.",
        "display_sensei.ui.scale_slider_hint": "Uniform scale: sets X, Y and Z",
        "display_sensei.ui.scale_axis_slider_hint": "Scale {axis} only",
        "display_sensei.ui.translation_slider_hint": "Move {axis} (−80 to 80 px)",
        "display_sensei.ui.reset_channel": "Bedrock default",
        "display_sensei.ui.reset_channel_hint": "Set {channel} back to Bedrock's default for this context: {values}. When every value is the default again, the context uses the Bedrock default.",
        "display_sensei.ui.scale_quick_hint": "Set X, Y and Z to {value}",
        "display_sensei.ui.scale_default_for": "Bedrock default for: {contexts}",
        "display_sensei.ui.advanced": "Advanced: pivots",
        "display_sensei.ui.rotation_pivot": "Rotation pivot",
        "display_sensei.ui.scale_pivot": "Scale pivot",
        "display_sensei.ui.mirror_from": "Mirror from {hand}",
        "display_sensei.ui.mirror_slot_hint": "Copies the {hand} values. Bedrock draws the left hand as a mirror image of the right, so equal values look mirrored. That is exact for models that are symmetric left to right; on others (an axe with its head on one side) the left item can face the other way, so check it in game, or use Same pose.",
        "display_sensei.ui.preset": "Preset",
        "display_sensei.ui.preset_choose": "Choose a preset…",
        "display_sensei.ui.preset_scope_context": "This context",
        "display_sensei.ui.preset_scope_all": "All contexts",
        "display_sensei.ui.apply_preset": "Apply",
        "display_sensei.ui.saved_presets": "Saved presets",
        "display_sensei.ui.copy_slot": "Copy",
        "display_sensei.ui.copy_slot_hint": "Copy this context's values to Blockbench's display clipboard (the same as Ctrl+C in Display Mode).",
        "display_sensei.ui.paste_slot": "Paste",
        "display_sensei.ui.paste_slot_hint": "Paste the copied values into this context, as one undo step. A mirrored slot becomes a 180° turn (Bedrock can't mirror), and the values are kept inside Bedrock's ranges.",
        "display_sensei.ui.save_preset": "Save preset…",
        "display_sensei.ui.save_preset_hint": "Save contexts of this project as a preset, with Blockbench's New Preset dialog. The dialog uses Blockbench's slot names (Thirdperson: 3rd Back and 3rd Front, Firstperson: 1st Person, Frame: Item Frame, Embedded: Flower Pot) and ticks every slot; untick the ones to leave out. Contexts that use the Bedrock default stay on it when the preset is applied. Saved presets appear in the list above; Display > Apply Preset can delete them.",
        "display_sensei.ui.geometry_version": "Geometry version",
        "display_sensei.ui.effective_version": "The export writes format_version {version}.",
        "display_sensei.ui.version_raised": "Raised from {selected}: shelf transforms need geometry {version}.",
        "display_sensei.ui.output_empty": "Every context uses the Bedrock default: nothing to write.",
        "display_sensei.ui.output_empty_tip": "The geometry gets no item_display_transforms while every context uses the Bedrock default. Edit a context, or untick Use Bedrock default, to write it.",
        "display_sensei.ui.export_geometry": "Export Geometry…",
        "display_sensei.ui.export_geometry_hint": "Opens Blockbench's Bedrock geometry export, which writes these transforms.",
        "display_sensei.ui.float_panel": "Float Panel",
        "display_sensei.ui.dock_panel": "Dock Panel",
        "display_sensei.ui.tab_panel": "Tab Panel",
        "display_sensei.ui.close_panel": "Close Panel",
        "display_sensei.ui.same_pose_from": "Same pose as {hand}",
        "display_sensei.ui.same_pose_slot_hint": "Copies the {hand} values with translation X, rotation Y and rotation Z negated, so the item faces the same way in both hands instead of looking mirrored.",
        "display_sensei.ui.match_first_person": "Match to 3rd person",
        "display_sensei.ui.match_first_person_hint": "Sets 1st Person so the item sits the way it does in 3rd person, in each hand whose 3rd person you changed (a hand on the Bedrock default keeps its 1st Person). Bedrock places first person in front of the camera and third person on the arm, so copying the values never matches: this carries your third-person change over relative to Bedrock's own defaults, which look right in both. The left hand mirrors the right, as in 3rd person; that is exact for models symmetric left to right, and how the game places the left hand here is not measured in game yet. One undo step; check the result in game.",
        "display_sensei.ui.send_to_first_person": "Send to 1st person",
        "display_sensei.ui.send_to_first_person_hint": "Sets 1st Person so the item sits the way it does in this third-person hold, in each hand whose 3rd person you changed (a hand on the Bedrock default keeps its 1st Person). Bedrock places first person in front of the camera and third person on the arm, so copying the values never matches: this carries your third-person change over relative to Bedrock's own defaults, which look right in both. The left hand mirrors the right; how the game places it is not measured in game yet. One undo step; check the result in game.",
        "display_sensei.ui.hand_views": "Other views",
        "display_sensei.ui.hand_views_hint": "Small pictures of this hand's other views, drawn again after every change, so 1st Person, 3rd Back and 3rd Front can be set together. Click a picture to show that view. Nothing here is saved.",
        "display_sensei.ui.hand_view_hint": "Show {view}",
        "display_sensei.ui.hand_views_preview_only_hint": "These pictures are drawn for you only: nothing in them is saved in the project or exported.",
        "display_sensei.ui.turn_180": "Turn 180°",
        "display_sensei.ui.turn_180_hint": "Bedrock can't mirror an item (its scale can't be negative), but a 180° turn about one axis looks exactly like mirroring the other two. Turns about the rotation pivot.",
        "display_sensei.ui.turn_axis_hint": "Turn 180° about {axis}: looks the same as mirroring {axes}.",
        "display_sensei.ui.turn_item": "Turn about the item's own axis ({amount}°)",
        "display_sensei.ui.turn_item_hint": "Turns the item {amount}° per click about its own X, Y or Z axis, at any rotation. Unlike the X, Y and Z values, this also tilts the item where X and Z turn it the same way (Y at 90° or −90°). One undo step per click.",
        "display_sensei.ui.turn_item_axis_hint": "Turn the item {amount}° about its own {axis} axis. One undo step.",
        "display_sensei.ui.tidy_rotation": "Tidy to {values}",
        "display_sensei.ui.tidy_rotation_hint": "Writes the rotation as {values}: the same look within {change}°, with Y on the 90° line and Z added into X, so X alone says how the item is tilted. One undo step.",
        "display_sensei.ui.preset_estimate": "Estimate",
        "display_sensei.ui.preset_uncalibrated": "Not calibrated yet",
        "display_sensei.ui.preset_calibrated": "Your hold",
        "display_sensei.ui.calibrate_item_hold": "Use these hands as my Item hold",
        "display_sensei.ui.calibrate_item_hold_hint": "Saves this project's four hand contexts (1st Person and 3rd Person, both hands) as your Item hold. It is kept in Blockbench on this computer, not in the project, and uninstalling Display Sensei deletes it. The Item hold preset applies it from now on.",
        "display_sensei.ui.calibrate_tool_hold": "Use these hands as my Tool hold",
        "display_sensei.ui.calibrate_tool_hold_hint": "Saves this project's four hand contexts (1st Person and 3rd Person, both hands) as your Tool hold. It is kept in Blockbench on this computer, not in the project, and uninstalling Display Sensei deletes it. The Tool hold and Rod presets apply it from now on.",
        "display_sensei.ui.forget_calibration": "Forget my {hold}",
        "display_sensei.ui.forget_calibration_hint": "Deletes your saved {hold}; this can't be undone. The preset then uses its own hands again (the Item hold has none until you calibrate it).",
        "display_sensei.ui.replace_hold_title": "Replace your {hold}?",
        "display_sensei.ui.replace_hold_message": "You already saved a {hold}. Saving these hands replaces it, and that can't be undone: the hold is kept in Blockbench, outside the project and its undo.",
        "display_sensei.ui.replace_hold_confirm": "Replace my {hold}",
        "display_sensei.ui.forget_hold_title": "Forget your {hold}?",
        "display_sensei.ui.forget_hold_message": "Your saved {hold} will be deleted, and that can't be undone: the hold is kept in Blockbench, outside the project and its undo.",
        "display_sensei.ui.forget_hold_confirm": "Forget my {hold}",
        "display_sensei.ui.cancel": "Cancel",
        "display_sensei.ui.go_left_hand": "Edit the left hand",
        "display_sensei.ui.go_left_hand_hint": "Opens Hand > Left.",
        "display_sensei.ui.go_armor_head": "Open Armor > Head",
        "display_sensei.ui.go_armor_head_hint": "Opens the Armor tab's Head card, which checks how this item sits on a wearer's head.",
        "display_sensei.tab.hand": "Hand",
        "display_sensei.tab.world": "World",
        "display_sensei.tab.inventory": "Inventory",
        "display_sensei.tab.output": "Output",
        "display_sensei.tab.armor": "Armor",
        "display_sensei.subtab.first_person": "1st Person",
        "display_sensei.subtab.third_back": "3rd Back",
        "display_sensei.subtab.third_front": "3rd Front",
        "display_sensei.subtab.item_frame": "Item Frame",
        "display_sensei.subtab.ground": "Ground",
        "display_sensei.subtab.shelf": "Shelf",
        "display_sensei.subtab.flower_pot": "Flower Pot",
        "display_sensei.subtab.gui": "GUI",
        "display_sensei.subtab.head": "Head",
        "display_sensei.subtab.armor_head": "Head",
        "display_sensei.subtab.armor_chest": "Chest",
        "display_sensei.subtab.armor_legs": "Legs",
        "display_sensei.subtab.armor_feet": "Feet",
        "display_sensei.subtab.armor_offhand": "Offhand",
        "display_sensei.route.block": "Block route",
        "display_sensei.route.attachable": "Attachable route",
        "display_sensei.route.block_hint": "Bedrock Block format. Edits item_display_transforms in the block geometry, for every context.",
        "display_sensei.route.attachable_hint": "Bedrock Entity projects for a 3D item that is held or worn (an attachable), and new ones not yet known to be a mob. Edits the first- and third-person hold animations.",
        "display_sensei.route.entity": "Entity route",
        "display_sensei.route.entity_hint": "Bedrock Entity projects for a mob (a client entity). Display places show items and blocks, not mobs, so there is nothing to edit; the Output tab lists your pack's files for it.",
        "display_sensei.context.thirdperson_righthand": "Third person, right hand",
        "display_sensei.context.thirdperson_lefthand": "Third person, left hand",
        "display_sensei.context.firstperson_righthand": "First person, right hand",
        "display_sensei.context.firstperson_lefthand": "First person, left hand",
        "display_sensei.context.ground": "Dropped on the ground",
        "display_sensei.context.fixed": "Item frame",
        "display_sensei.context.head": "Worn on the head",
        "display_sensei.context.gui": "Inventory and GUI",
        "display_sensei.context.embedded": "Flower pot",
        "display_sensei.context.shelf": "Shelf",
        "display_sensei.context.attachable_first_person": "Attachable first-person animation",
        "display_sensei.context.attachable_third_person": "Attachable third-person animation",
        "display_sensei.info.first_person": "How the item sits in the player's own hand in first-person view.",
        "display_sensei.info.first_person_frame": "Bedrock places it in front of the camera, not on the arm: use Match to 3rd person.",
        "display_sensei.info.first_person_frame_tip": "Bedrock places 1st Person apart from 3rd person: in front of the camera, not on the arm, so equal values never look alike in both. Match to 3rd person starts 1st Person from your 3rd-person hold.",
        "display_sensei.info.third_back": "How other players see the item in hand from behind (the first F5 view).",
        "display_sensei.info.third_front": "How the item in hand looks from the front (the second F5 view).",
        "display_sensei.info.third_front_shared": "Same values as 3rd Back (Bedrock has no front data); only the camera changes.",
        "display_sensei.info.item_frame": "How the item sits inside an item frame.",
        "display_sensei.info.ground": "How the item looks when dropped on the ground, where it spins and bobs.",
        "display_sensei.info.shelf": "How the item sits on a shelf.",
        "display_sensei.info.flower_pot": "How the item looks planted in a flower pot (the block needs minecraft:flower_pottable).",
        "display_sensei.info.gui": "How the item looks in the inventory, the hotbar and other GUI slots.",
        "display_sensei.info.head": "How the item looks when worn in the head slot.",
        "display_sensei.info.head_wearable": "Worn on the head only through minecraft:wearable (slot.armor.head).",
        "display_sensei.info.head_wearable_tip": "In Bedrock a block item is worn on the head only when its item has minecraft:wearable with slot.armor.head, through minecraft:block_placer with replace_block_item.",
        "display_sensei.info.shelf_alignment": "Bedrock centres shelf items: no Top / Bottom alignment.",
        "display_sensei.info.shelf_alignment_tip": "Bedrock centres shelf items; there is no Top / Bottom alignment. Use translation Y to move the item up or down (whether the game honours it is not measured in game yet).",
        "display_sensei.info.blockbench_slot_name": "Blockbench calls this slot {slot}; Display Sensei writes it to the geometry as {key}.",
        "display_sensei.info.attachable_hands": "Right hand is the main hand and left hand is the off hand (c.item_slot).",
        "display_sensei.info.icon_title": "Icon only on this route",
        "display_sensei.info.icon": "Bedrock shows the item's icon here (minecraft:icon).",
        "display_sensei.info.icon_tip": "Not the attachable model. A 3D model in this context needs the Block route (a Bedrock Block project).",
        "display_sensei.info.block_only_title": "Block route only",
        "display_sensei.info.block_only": "Only block items have this context.",
        "display_sensei.info.block_only_tip": "It is part of item_display_transforms, which only block geometry has. Open a Bedrock Block project to edit it.",
        "display_sensei.info.mob_title": "A mob, not an item",
        "display_sensei.info.mob": "Display places show items and blocks, not mobs.",
        "display_sensei.info.mob_tip": "This project is a mob (a client entity), so there is nothing to edit in the hand, item frame, ground, GUI or the other display places. The Output tab lists your pack's files for this mob.",
        "display_sensei.info.no_route_title": "Open a Bedrock project",
        "display_sensei.info.no_route": "Display Sensei works with these Bedrock formats:",
        "display_sensei.info.current_format": "Current format: {format}",
        "display_sensei.info.output_entity": "Display Sensei writes no mob files. Ctrl+S saves the model as usual.",
        "display_sensei.info.shelf_version": "The shelf needs geometry {version}, so the export uses it instead of {selected}.",
        "display_sensei.info.shelf_version_tip": "Geometry version {selected} is chosen on the Output tab, but Bedrock reads shelf transforms only from {version} on. While the shelf is written, the export uses {version}.",
        "display_sensei.info.shelf_copies_frame": "At geometry {selected} the shelf copies the Item Frame values.",
        "display_sensei.info.shelf_copies_frame_tip": "At geometry {selected} the game copies the Item Frame transforms to a shelf that is not written, so the preview shows the Item Frame values here.",
        "display_sensei.info.fit_to_frame_version": "Before geometry {version}, fit_to_frame off can draw the item larger than its slot.",
        "display_sensei.info.item_frame_version": "The 26.10 item frame fix (geometry {version}) only affects full_block models.",
        "display_sensei.info.item_frame_version_tip": "The export writes geometry {selected}. Minecraft 26.10 fixed the item frame rotation from geometry {version} on, but only for blocks drawn with minecraft:geometry.full_block; a custom model like this one looks the same either way.",
        "display_sensei.info.entity_display_kept": "This file's own item_display_transforms are kept unchanged.",
        "display_sensei.info.entity_display_kept_tip": "This geometry file has its own item_display_transforms. They are written back unchanged; open the file as a Bedrock Block project to edit them.",
        "display_sensei.info.pivot_units": "Pivot units (pixels or blocks): not measured in game yet.",
        "display_sensei.info.pivot_marked": "Marked in the viewport. Units: not measured in game yet.",
        "display_sensei.info.pivot_markers_tip": "In Display Mode the viewport marks both pivots while this section is open. Ring: the rotation pivot, the point the item turns around (no effect at rotation 0). Diamond: the scale pivot, the point the item shrinks or grows toward (no effect at scale 1). With both at 0 the marks sit at the item's origin. The preview reads pivots in blocks (1 = 16 pixels).",
        "display_sensei.info.gimbal_lock": "Y is {y}°: X and Z turn the item about the same axis.",
        "display_sensei.info.gimbal_lock_tip": "Y is {y}°: here X and Z turn the item about the same axis, so they can't tilt it the other way. Use Turn about the item's own axis below, or move Y off {y}° first.",
        "display_sensei.info.gimbal_near": "Y is within 1° of {y}°: X and Z turn the item almost the same way.",
        "display_sensei.info.gimbal_near_tip": "Y is within 1° of {y}°: here X and Z turn the item about almost the same axis, so their numbers can grow large and cancel out. Use Turn about the item's own axis below to tilt it.",
        "display_sensei.info.armor_head": "What the wearer shows in the head slot (slot.armor.head): an armor piece follows the wearer's head through bones named head and hat; a block item uses its Head display.",
        "display_sensei.info.armor_chest": "What the wearer shows in the chest slot (slot.armor.chest): an armor piece follows the wearer's body and arms through bones named body, rightArm and leftArm.",
        "display_sensei.info.armor_legs": "What the wearer shows in the legs slot (slot.armor.legs): an armor piece follows the wearer's waist and legs through bones named body, rightLeg and leftLeg.",
        "display_sensei.info.armor_feet": "What the wearer shows in the feet slot (slot.armor.feet): an armor piece follows the wearer's legs through bones named rightLeg and leftLeg.",
        "display_sensei.info.armor_offhand": "Held in the off hand (slot.weapon.offhand), on the wearer's leftItem bone. It is edited as the left hand.",
        "display_sensei.info.worn_body_title": "Worn on the body: 3D items only",
        "display_sensei.info.worn_body": "No body context in item_display_transforms: a piece worn here is a 3D item.",
        "display_sensei.info.worn_body_tip": "item_display_transforms has no chest, legs or feet context, so a block has nothing to set here. A piece worn in this slot is a 3D item: a Bedrock Entity model with bones named like the wearer's (body, rightArm, leftArm, rightLeg, leftLeg), drawn by its attachable. Open it as a Bedrock Entity project, where the Armor tab checks its fit. Whether a block item can be worn in this slot is not measured in game yet.",
        "display_sensei.info.offhand_pointer_title": "Offhand: the left hand",
        "display_sensei.info.offhand_pointer_block": "Drawn with thirdperson_lefthand and firstperson_lefthand.",
        "display_sensei.info.offhand_pointer_block_tip": "An item in the offhand (slot.weapon.offhand) is drawn with the left-hand contexts, thirdperson_lefthand and firstperson_lefthand. The game draws the left hand as a mirror image of the right. Edit them on Hand > Left.",
        "display_sensei.info.offhand_pointer_attachable": "Plays the main hand's hold animations; c.item_slot tells the hands apart.",
        "display_sensei.info.offhand_pointer_attachable_tip": "An attachable in the offhand (slot.weapon.offhand) plays the same hold animations as in the main hand: Bedrock does not mirror attachables. To place it differently there, the animations check c.item_slot ('off_hand'), as the vanilla shield does. This is edited on Hand > Left. How it looks in the offhand is not measured in game yet.",
        "display_sensei.info.worn_pointer_title": "Worn on the head: Armor > Head",
        "display_sensei.info.worn_pointer": "Its fit is checked on Armor > Head.",
        "display_sensei.info.worn_pointer_tip": "A 3D item worn on the head is drawn by its attachable, with bones named like the wearer's head. Its fit is checked on Armor > Head. The head context here (item_display_transforms) only places block items, on the Block route.",
        "display_sensei.message.no_tab_host": "There is no panel in the right sidebar to join as a tab, so the panel was docked instead.",
        "display_sensei.message.open_failed": "Display Sensei could not open its panel. See the console for details.",
        "display_sensei.message.preset_not_applicable": "This preset has no values for the chosen context.",
        "display_sensei.message.preset_not_calibrated": "This hold is not calibrated yet. Set the hands by eye, then press \"Use these hands as my Item hold\" under the preset list in Display Sensei's panel (Tools > Display Sensei).",
        "display_sensei.message.preset_matched_first_person": "First person was matched from third person. Check it in game.",
        "display_sensei.message.first_person_matched": "1st Person now matches 3rd person, both hands. Check it in game.",
        "display_sensei.message.first_person_matched_hand": "1st Person now matches 3rd person in the {hand}. Check it in game. The {kept} kept its 1st Person: its 3rd person uses the Bedrock default.",
        "display_sensei.message.first_person_nothing_to_match": "Both hands' 3rd person use the Bedrock default, so 1st Person was left as it is: Bedrock's own defaults already go together.",
        "display_sensei.message.first_person_clamped": "Only partly matched: Bedrock's limits (translation −80 to 80 px, scale up to 4) were reached in 1st Person.",
        "display_sensei.message.first_person_turned": "The rotation was put on Y ±90° so its numbers read plainly; the item turned {change}° for it.",
        "display_sensei.message.rotation_tidied": "Rotation tidied to {values}; the item turned {change}°.",
        "display_sensei.message.calibrated_rule_differs": "This hold was saved under another left-hand rule than Display Sensei uses now. Check its left hands in game.",
        "display_sensei.message.hold_calibrated": "Saved these hands as your {hold}.",
        "display_sensei.message.hold_forgotten": "Your {hold} was deleted.",
        "display_sensei.message.copied": "Copied the item_display_transforms property.",
        "display_sensei.message.slot_copied": "Copied this context's values. Pick another context and press Paste.",
        "display_sensei.message.nothing_to_paste": "Nothing to paste yet. Copy a context first.",
        "display_sensei.message.view_failed": "Display Sensei could not show this view in Display Mode. See the console for details.",
        "display_sensei.message.values_clamped": "Values outside Bedrock's allowed ranges were clamped.",
        "display_sensei.message.file_values_clamped": "The geometry file has display values outside Bedrock's allowed ranges. Display Sensei clamped them, so the preview shows what the export writes.",
        "display_sensei.message.file_version_raised": "The file's format_version was raised from {from} to {version}, because the shelf transforms need it. This changes how the game reads every geometry in the file.",
        "display_sensei.message.file_version_kept": "The file holds other geometries, so its format_version {version} was kept instead of {chosen}.",
        "display_sensei.message.preset_source_version": "{preset} comes from a geometry {version} file; this project writes {selected}. Check it in game.",
        "display_sensei.message.mirror_converted": "A mirrored slot was turned 180° instead (Bedrock has no mirroring); it looks the same.",
        "display_sensei.message.mirror_approximated": "Bedrock can't mirror, and this mirror has no exact 180° turn. The slot was turned 180° about {axis} instead, which matches only if the model is symmetric along {leftover}.",
        "display_sensei.message.left_hand_inherits": "The left hand uses Bedrock's default, not a mirror of the right.",
        "display_sensei.message.item_wizard_compile": "The Item Wizard is building its 3D item model from this project. Display Sensei left item_display_transforms out of that model: an attachable is placed in the hand by its hold animations, not by display transforms.",
        "display_sensei.message.block_wizard_version": "The Block Wizard saves this geometry with format_version 1.21.110 when it has display transforms. {features} After exporting to a folder or into a pack, press Ctrl+S in this project: the wizard points this project's save path at the geometry it wrote, and Display Sensei saves it again with the version it needs.",
        "display_sensei.message.armor_pose_edit_mode": "The pose test runs in Edit mode only.",
        "display_sensei.message.armor_fix_failed": "This fix could not be applied to the model as it is now.",
        "display_sensei.message.armor_bake_failed": "Nothing was baked: there are no offsets, or they could not be written into the model.",
        "display_sensei.message.armor_bake_missing": "Not baked, no bone of that name: {bones}. Their offsets are kept.",
        "display_sensei.wizard_feature.shelf": "The shelf copies the Item Frame transforms (shelf transforms need 1.26.40).",
        "display_sensei.wizard_feature.fit_to_frame_off": "fit_to_frame off can draw the item larger than its GUI slot (fixed from geometry 1.21.130).",
        "display_sensei.save_guard.title": "Save into models/entity?",
        "display_sensei.save_guard.message": "This Bedrock Block project saves its geometry `{identifier}` into `{path}`.\n\nThe `models/entity/` folder holds entity and attachable models. If that file is a 3D item (attachable) model, for example one the Item Wizard made after its \"Use current model\" pointed this project's save path there, saving writes block geometry with `item_display_transforms` over it: it has no bone bound to the hand, and Blockbench opens the file as a Bedrock Block project from then on.\n\nA block model kept there on purpose is fine to save.",
        "display_sensei.save_guard.renamed": "The identifier `{identifier}` matches this file's name, which is what the Item Wizard's \"Use current model\" leaves: it renames the model's identifier to the item's name. If it did so here, set the identifier back to the block's own (File > Project, Model Identifier) before you save into the block's own file: under the item's name, the block no longer finds its geometry there.",
        "display_sensei.save_guard.save_anyway": "Save anyway",
        "display_sensei.save_guard.save_elsewhere": "Save somewhere else…",
        "display_sensei.save_guard.dont_ask": "Don't ask again for this project",
        "display_sensei.link.title": "Your pack",
        "display_sensei.link.intro": "The files in your pack that belong to this model, found by what is in them. Display Sensei only reads them. Any pack works: made by hand, with another tool or with one of Blockbench's wizards.",
        "display_sensei.link.pending": "Reading your pack…",
        "display_sensei.link.empty_no_path": "No file on disk yet: save the project, or open it from a pack.",
        "display_sensei.link.empty_not_in_pack": "This file is not inside a resource pack.",
        "display_sensei.link.empty_not_in_pack_tip": "None of the folders above it has a manifest.json with a resources module. Open the model from a pack to see its files here.",
        "display_sensei.link.empty_desktop_only": "Reading pack files needs the Blockbench desktop app.",
        "display_sensei.link.empty_error": "Display Sensei could not read this pack; the console has the details.",
        "display_sensei.link.rp": "Resource pack: {name}",
        "display_sensei.link.bp": "Behavior pack: {name}",
        "display_sensei.link.bp_missing": "Behavior pack: none found.",
        "display_sensei.link.bp_ambiguous": "Behavior pack: several match ({names}).",
        "display_sensei.link.bp_ambiguous_tip": "None is listed because several behavior packs belong to this resource pack. This usually means one was copied from another without new uuids.",
        "display_sensei.link.stamps": "Stamped by: {tools}",
        "display_sensei.link.no_stamp": "No wizard stamp (made by hand or with another tool).",
        "display_sensei.link.stamps_hint": "A tool such as a wizard adds its stamp to the pack's manifest.json each time it exports into the pack, so a stamp means it worked on this pack at least once, not that it made every file.",
        "display_sensei.link.files_rp": "Resource pack files",
        "display_sensei.link.files_bp": "Behavior pack files",
        "display_sensei.link.files_maybe_game": "Not in your pack: the game's own, or missing",
        "display_sensei.link.files_game": "From the game (not in your pack)",
        "display_sensei.link.kind_look": "Look",
        "display_sensei.link.kind_look_hint": "Changes how the model looks in the game: models, textures, animations and the lists that point to them.",
        "display_sensei.link.kind_code": "Code",
        "display_sensei.link.kind_code_hint": "How the item, block or mob works, and the pack itself: behavior files, manifests, names and sounds.",
        "display_sensei.link.not_found": "Not in this pack",
        "display_sensei.link.not_found_detail": "nothing in {path} defines {id}",
        "display_sensei.link.not_found_uses_detail": "no file in {path} uses {id}",
        "display_sensei.link.game_detail": "the game's own",
        "display_sensei.link.maybe_game_detail": "the game's own, or missing",
        "display_sensei.link.bp_unknown_detail": "not checked: behavior pack not found",
        "display_sensei.link.bp_ambiguous_detail": "not checked: several behavior packs match",
        "display_sensei.link.rewritten": "Wizard rewrites",
        "display_sensei.link.rewritten_hint_item": "The Item Wizard's Export to Folder writes this file again. Integrate into Pack writes it again too, except the shared lists, which it merges with yours (item_texture.json, the language file), and the manifests and pack icons, which it leaves as they are apart from adding its stamp.",
        "display_sensei.link.rewritten_hint_block": "The Block Wizard's Export to Folder writes this file again. Integrate into Pack writes it again too, the model and its textures included, except the shared lists, which it merges with yours (terrain_texture.json, flipbook_textures.json, blocks.json, the language file), and the manifests and pack icons, which it leaves as they are apart from adding its stamp.",
        "display_sensei.link.rewritten_hint_entity": "The Entity Wizard's Export to Folder writes this file again. Integrate into Pack writes it again too, the model and its textures included, except the shared lists, which it merges with yours (item_texture.json, sounds.json, the language file), and the manifests and pack icons, which it leaves as they are apart from adding its stamp.",
        "display_sensei.link.refresh": "Refresh",
        "display_sensei.link.refresh_hint": "Read the pack files again, for example after you changed them outside Blockbench.",
        "display_sensei.link.open_rp": "Open resource pack",
        "display_sensei.link.open_rp_hint": "Show the resource pack's folder in your file browser.",
        "display_sensei.link.open_bp": "Open behavior pack",
        "display_sensei.link.open_bp_hint": "Show the behavior pack's folder in your file browser.",
        "display_sensei.link_role.geometry": "Model (geometry)",
        "display_sensei.link_role.attachable": "Attachable (the 3D item and its hold animations)",
        "display_sensei.link_role.client_entity": "Client entity (how the mob is drawn)",
        "display_sensei.link_role.animation": "Animation",
        "display_sensei.link_role.render_controller": "Render controller",
        "display_sensei.link_role.texture": "Texture",
        "display_sensei.link_role.item_texture": "Item icon list",
        "display_sensei.link_role.icon": "Item icon",
        "display_sensei.link_role.spawn_egg": "Spawn egg picture",
        "display_sensei.link_role.terrain_texture": "Block texture list",
        "display_sensei.link_role.flipbook": "Animated texture list",
        "display_sensei.link_role.item": "Item (behavior)",
        "display_sensei.link_role.entity": "Entity (behavior)",
        "display_sensei.link_role.block": "Block (behavior)",
        "display_sensei.link_role.lang": "Names (language file)",
        "display_sensei.link_role.sounds": "Sound list",
        "display_sensei.link_role.blocks_json": "Block sounds and settings",
        "display_sensei.link_role.manifest": "Pack manifest",
        "display_sensei.link_role.pack_icon": "Pack icon",
        "display_sensei.wizard_name.item": "Item Wizard",
        "display_sensei.wizard_name.block": "Block Wizard",
        "display_sensei.wizard_name.entity": "Entity Wizard",
        "display_sensei.wizard_preset.iron_ingot": "Iron Ingot",
        "display_sensei.wizard_preset.apple": "Apple",
        "display_sensei.wizard_preset.sword": "Sword",
        "display_sensei.wizard_preset.pickaxe": "Pickaxe",
        "display_sensei.wizard_preset.helmet": "Helmet",
        "display_sensei.wizard_preset.chestplate": "Chestplate",
        "display_sensei.wizard_preset.leggings": "Leggings",
        "display_sensei.wizard_preset.boots": "Boots",
        "display_sensei.link_note.no_entity_file": "No attachable or client entity file names {identifier} yet.",
        "display_sensei.link_note.no_entity_file_tip": "No attachable or client entity file in this pack names {identifier} yet, so the pack does not tell whether this model is a held item or a mob. In Bedrock a held or worn 3D item is drawn through a file in attachables/ that names its geometry, and a mob through one in entity/. Until such a file exists, Display Sensei keeps this project on the Attachable route.",
        "display_sensei.link_note.wearable_armor": "Worn in {slot}: the hand shows the flat icon, not this model.",
        "display_sensei.link_note.wearable_armor_tip": "Worn in {slot}: the game shows the 3D model only while the item is worn there. In the hand it shows the item's flat icon (minecraft:icon) instead, so the hold animations do not show in the hand.",
        "display_sensei.link_note.wearable_offhand": "Can be worn in the off hand (slot.weapon.offhand).",
        "display_sensei.link_note.wearable_offhand_tip": "Worn in the off hand (slot.weapon.offhand), so the item can be held in the left hand. Bedrock does not mirror attachables: the left hand plays the same hold animations as the right unless they check c.item_slot. How it looks there is not measured in game yet.",
        "display_sensei.link_note.mount_slot": "{slot} is not a wearable slot in Bedrock.",
        "display_sensei.link_note.mount_slot_tip": "{slot} is not a wearable slot in Bedrock: it is a command slot of horses, donkeys and llamas, which do not draw attachables. Expect a content log error and the item's wearable component not to work. The closest real slot is slot.armor.body, drawn on wolves and happy ghasts. Neither is measured in game yet.",
        "display_sensei.link_note.hand_equipped": "minecraft:hand_equipped: the flat icon is held like a tool.",
        "display_sensei.link_note.hand_equipped_tip": "minecraft:hand_equipped is on: the flat icon is held like a tool in third person. With a 3D model this only matters where the hand shows the icon, such as an item worn in an armor slot.",
        "display_sensei.link_note.glint": "Enchantment shimmer (glint); Blockbench's preview does not show it.",
        "display_sensei.link_note.glint_tip": "The item has the enchantment shimmer: minecraft:glint makes the icon shimmer, and a glint material on the attachable makes the 3D model always shimmer. Blockbench's preview does not show it.",
        "display_sensei.link_note.use_animation": "minecraft:use_animation \"{animation}\": an eating or drinking pose in first person.",
        "display_sensei.link_note.use_animation_tip": "minecraft:use_animation is \"{animation}\": while the item is used, the game shows its eating or drinking pose in first person. Display Sensei's Eating / Drinking reference (block route, 1st Person card, Display Mode) is an estimate of that pose, not measured in game yet.",
        "display_sensei.wizard_note.own_model": "This is the Item Wizard's own {preset} preset model.",
        "display_sensei.wizard_note.own_model_tip": "This model is the Item Wizard's own {preset} preset, not one you made: its shape matches that preset exactly. The wizard never writes this file again on a later export, so you can replace it with your own model once. Keep the geometry identifier and a root bone bound to the hand.",
        "display_sensei.link_note.saves_into": "Ctrl+S saves this project into {path} in this pack.",
        "display_sensei.wizard_note.reexport_item": "An Item Wizard re-export writes the files marked Wizard rewrites again.",
        "display_sensei.wizard_note.reexport_item_tip": "If you run the Item Wizard's Export to Folder again, it writes the files marked Wizard rewrites again: the attachable, its hold animation, the item icon list, the language file and both manifests, with new uuids (a world that uses the pack can lose it). It keeps the model, its texture and the icon. Integrate into Pack is gentler with the shared lists (existing entries win) and keeps the manifests' uuids, but it still writes the attachable and the hold animation again.",
        "display_sensei.wizard_note.reexport_block": "A Block Wizard re-export writes the files marked Wizard rewrites again.",
        "display_sensei.wizard_note.reexport_block_tip": "If you run the Block Wizard's Export to Folder again, it writes every file marked Wizard rewrites again, the model and its textures included, and both manifests with new uuids (a world that uses the pack can lose it). Integrate into Pack is gentler with the shared lists and manifests, but still writes the model again. Your display settings stay in this project: save it again afterwards to write them back.",
        "display_sensei.wizard_note.reexport_entity": "An Entity Wizard re-export writes the files marked Wizard rewrites again.",
        "display_sensei.wizard_note.reexport_entity_tip": "If you run the Entity Wizard's Export to Folder again, it writes every file marked Wizard rewrites again, the model and its textures included, and both manifests with new uuids (a world that uses the pack can lose it). Integrate into Pack is gentler with the shared lists and manifests, but still writes the model again.",
        "display_sensei.wizard_note.block_wizard_version": "A Block Wizard export saves format_version 1.21.110, which drops some display values.",
        "display_sensei.wizard_note.block_wizard_version_tip": "If you export this model with the Block Wizard, it saves the geometry with format_version 1.21.110. {features} After a wizard export, press Ctrl+S in this project to save it again with the version it needs.",
        "display_sensei.action.open_name": "Display Sensei",
        "display_sensei.action.open_description": "Edit how Bedrock blocks and 3D items display, and how armor fits.",
        "display_sensei.preset.bedrock_defaults": "Bedrock defaults",
        "display_sensei.preset.item_hold": "Item hold",
        "display_sensei.preset.tool_hold": "Tool hold",
        "display_sensei.preset.rod_hold": "Rod (tool hold)",
        "display_sensei.preset.sword_calibration": "Sword (calibrated by eye)",
        "display_sensei.preset.not_calibrated_label": "{name} (not calibrated yet)",
        "display_sensei.preset.armor_stand_statue": "Statue on a Bedrock armor stand",
        "display_sensei.preset.vanilla_shelf_mushroom": "Wall decoration (vanilla Shelf Mushroom)",
        "display_sensei.preset.vanilla_shelf_mushroom_large": "Wall decoration, large (vanilla)",
        "display_sensei.preset.vanilla_straw_bed": "Flat floor model (vanilla Straw Bed)",
        "display_sensei.preset.ms_umbrella": "Upright pole (Microsoft sample)",
        "display_sensei.preset_note.bedrock_defaults": "Leaves every context out of the geometry, so the game uses its own default transforms.",
        "display_sensei.preset_note.item_hold": "For flat, sprite-like items. Hands only. Not calibrated yet: Bedrock draws this hold in code, so no game file has its numbers, and it is not measured in game yet. Hold an item the way you want in 1st Person, 3rd Back and 3rd Front, then press \"Use these hands as my Item hold\".",
        "display_sensei.preset_note.item_hold_calibrated": "For flat, sprite-like items. Hands only: your own Item hold, saved with \"Use these hands as my Item hold\" (kept in Blockbench on this computer).",
        "display_sensei.preset_note.tool_hold": "For tools and weapons (minecraft:hand_equipped). Hands only. Third person is a sword hold calibrated by eye in Blockbench; first person is matched from third person. Bedrock draws this hold in code, so no game file has its numbers, and it is not measured in game yet: check it there.",
        "display_sensei.preset_note.tool_hold_calibrated": "For tools and weapons (minecraft:hand_equipped). Hands only: your own Tool hold, saved with \"Use these hands as my Tool hold\" (kept in Blockbench on this computer).",
        "display_sensei.preset_note.rod_hold": "Bedrock has no separate rod hold: vanilla rods such as the breeze rod use the tool hold, so this is the Tool hold (hands only; first person matched from third person, check it in game).",
        "display_sensei.preset_note.rod_hold_calibrated": "Bedrock has no separate rod hold: vanilla rods such as the breeze rod use the tool hold, so this is your own Tool hold (hands only).",
        "display_sensei.preset_note.sword_calibration": "Every context of a sword calibrated by eye in Blockbench: third person, ground, item frame, GUI, flower pot and shelf; first person is matched from third person. Not measured in game yet, so check it there. Its shelf needs geometry 1.26.40.",
        "display_sensei.preset_note.armor_stand_statue": "Shows the model full size, standing on the ground, on an invisible armor stand. Set the armor stand to the \"none\" pose. The hands are worked out from the Bedrock armor stand's arms.",
        "display_sensei.preset_note.saved": "Saved with Blockbench's New Preset dialog. Blockbench keeps one preset list for every project format, so a preset saved in another format holds that format's values.",
        "display_sensei.preset_note.saved_mirror": "It holds a mirror, which becomes a 180° turn (Bedrock can't mirror).",
        "display_sensei.preset_note.vanilla_shelf_mushroom": "Vanilla example (geometry 1.21.0): values tuned for that model, a small mushroom hung on a wall.",
        "display_sensei.preset_note.vanilla_shelf_mushroom_large": "Vanilla example (geometry 1.21.0): values tuned for that model, a large mushroom hung on a wall.",
        "display_sensei.preset_note.vanilla_straw_bed": "Vanilla example (geometry 1.26.50): values tuned for that model, a flat bed lying on the floor.",
        "display_sensei.preset_note.ms_umbrella": "Microsoft's umbrella sample: values tuned for that model. It writes the right hands and the item frame only; the left hands keep their values.",
        "display_sensei.preset_group.bedrock": "Bedrock",
        "display_sensei.preset_group.vanilla": "Vanilla examples",
        "display_sensei.reference.block": "Block",
        "display_sensei.reference.bedrock_player": "Player",
        "display_sensei.reference.bedrock_zombie": "Zombie",
        "display_sensei.reference.bedrock_baby_zombie": "Baby Zombie",
        "display_sensei.reference.bedrock_armor_stand": "Armor Stand",
        "display_sensei.reference.bedrock_armor_stand_posed": "Armor Stand (Poses)",
        "display_sensei.reference.bedrock_fp_hold": "Normal",
        "display_sensei.reference.bedrock_fp_bow": "Bow Drawn",
        "display_sensei.reference.bedrock_fp_crossbow": "Crossbow Loading",
        "display_sensei.reference.bedrock_fp_spear": "Spear Hold",
        "display_sensei.reference.bedrock_fp_eat": "Eating / Drinking",
        "display_sensei.reference.bedrock_fox": "Fox",
        "display_sensei.reference.bedrock_frame": "Item Frame",
        "display_sensei.reference.bedrock_glow_frame": "Glow Item Frame",
        "display_sensei.reference.bedrock_frame_floor": "Item Frame (Floor)",
        "display_sensei.reference.bedrock_glow_frame_floor": "Glow Item Frame (Floor)",
        "display_sensei.reference.bedrock_frame_ceiling": "Item Frame (Ceiling)",
        "display_sensei.reference.bedrock_glow_frame_ceiling": "Glow Item Frame (Ceiling)",
        "display_sensei.reference.bedrock_flower_pot": "Flower Pot",
        "display_sensei.reference.bedrock_shelf": "Shelf (All Slots)",
        "display_sensei.reference.bedrock_shelf_left": "Shelf (Left Slot)",
        "display_sensei.reference.bedrock_shelf_center": "Shelf (Center Slot)",
        "display_sensei.reference.bedrock_shelf_right": "Shelf (Right Slot)",
        "display_sensei.reference.bedrock_gui_grid": "3x3",
        "display_sensei.reference.bedrock_gui_inventory": "Inventory",
        "display_sensei.reference.bedrock_gui_hotbar": "Hotbar",
        "display_sensei.reference_note.bedrock_baby_zombie": "Bedrock's 26.10 baby zombie keeps its arms down while it holds an item in its main hand.",
        "display_sensei.reference_note.bedrock_armor_stand_posed": "Bedrock has no small armor stand; Bedrock armor stands take 13 poses instead.",
        "display_sensei.reference_note.bedrock_fp_bow": "Custom items can't draw like a bow in Bedrock; this is how the game moves the vanilla bow.",
        "display_sensei.reference_note.bedrock_fp_crossbow": "Custom items can't load like a crossbow in Bedrock; this is the vanilla crossbow while it loads.",
        "display_sensei.reference_note.bedrock_fp_spear": "Bedrock has no first-person horn pose and custom items can't toot; this is Bedrock's spear hold (minecraft:is_spear).",
        "display_sensei.reference_note.bedrock_fp_eat": "No game file has Bedrock's first-person eating motion (the game draws it in code). This shows the game's own third-person eating pose as seen from the eyes: an estimate, not measured in game yet.",
        "display_sensei.reference_note.bedrock_fp_hold": "Bedrock draws its first-person hold in code. This anchor is Display Sensei's estimate, on the vanilla arm's line of sight; it is not measured in game yet.",
        "display_sensei.reference_note.bedrock_fox": "Placed at the Bedrock fox's mouth bone. How the item turns there, and which display slot the game uses for it, are not measured in game yet.",
        "display_sensei.reference_note.hold_rule": "Where the hand holds the item is Display Sensei's estimate, which Bedrock's own default hold fits; no game file has it, and it is not measured in game yet.",
        "display_sensei.reference_note.head_anchor": "The head anchor (head centre, 0.625 scale) is Display Sensei's estimate; no game file has Bedrock's, and it is not measured in game yet.",
        "display_sensei.reference_note.frame_anchor": "The item's place and size in the frame are Display Sensei's estimate; no game file has Bedrock's, and they are not measured in game yet.",
        "display_sensei.reference_note.gui_facing": "Which side of the model the game shows with Bedrock's GUI turn (30, 45, 0) is not measured in game yet.",
        "display_sensei.reference_note.ground_motion": "The spin and bob rates and the bob height are Display Sensei's estimates; no game file has them, and they are not measured in game yet.",
        "display_sensei.reference_note.bedrock_glow_frame": "Bedrock has no invisible item frame; the glow item frame is Bedrock's frame variant.",
        "display_sensei.reference_note.bedrock_flower_pot": "Estimate: the item is centred 10 px up, so a 0.75 block fits the pot.",
        "display_sensei.reference_note.bedrock_shelf": "Bedrock centres shelf items and draws them at the item frame's size.",
        "display_sensei.reference_note.main_hand_only": "Bedrock plays this only in the main hand; mirrored here.",
        "display_sensei.reference_option.arm_pose": "Arm pose",
        "display_sensei.reference_option.arm_pose_hint": "Preview only: how the Bedrock player holds its arm, from the game's third-person animations. Use poses play in the main hand only, so the left hand offers Holding and Sneaking. The pose angle applies to Holding.",
        "display_sensei.reference_option.stand_pose": "Armor stand pose",
        "display_sensei.reference_option.stand_pose_hint": "Preview only: one of the 13 poses a Bedrock armor stand cycles through when you sneak and interact with it.",
        "display_sensei.reference_option.frame_rotation": "Item rotation",
        "display_sensei.reference_option.frame_rotation_hint": "Preview only: the item turns in 8 steps of 45° when you interact with the frame. Which way the game turns it is not measured in game yet.",
        "display_sensei.reference_option.face_dimming": "Face dimming",
        "display_sensei.reference_option.face_dimming_hint": "Preview only: Bedrock darkens block faces by the direction they face. Turn it off to see the model the way a material with face_dimming false draws it. Set in the block's material_instances (behaviour pack); it also affects the placed block.",
        "display_sensei.reference_option.fit_preview": "Preview Fit to Frame (estimate)",
        "display_sensei.reference_option.fit_preview_hint": "Preview only: Bedrock scales and moves the model so it fits its slot while Fit to frame is on. The preview does the same from the model's size in this view; the game's exact rule is not measured in game yet.",
        "display_sensei.arm_pose.holding": "Holding",
        "display_sensei.arm_pose.sneaking": "Sneaking",
        "display_sensei.arm_pose.eating": "Eating / Drinking",
        "display_sensei.arm_pose.eating_bite": "Eating, bite",
        "display_sensei.arm_pose.brushing": "Brushing",
        "display_sensei.arm_pose.spyglass": "Spyglass",
        "display_sensei.arm_pose.goat_horn": "Goat horn (vanilla only)",
        "display_sensei.arm_pose.spear_raise": "Spear / trident raised",
        "display_sensei.arm_pose.bow_aim": "Bow aim (vanilla bow)",
        "display_sensei.arm_pose.crossbow_load": "Crossbow loading (vanilla)",
        "display_sensei.arm_pose.crossbow_hold": "Crossbow charged (vanilla)",
        "display_sensei.arm_pose.shield_block": "Shield block (vanilla shield)",
        "display_sensei.stand_pose.default": "Default",
        "display_sensei.stand_pose.none": "None (arms straight)",
        "display_sensei.stand_pose.solemn": "Solemn",
        "display_sensei.stand_pose.athena": "Athena",
        "display_sensei.stand_pose.brandish": "Brandish",
        "display_sensei.stand_pose.honor": "Honor",
        "display_sensei.stand_pose.entertain": "Entertain",
        "display_sensei.stand_pose.salute": "Salute",
        "display_sensei.stand_pose.riposte": "Riposte",
        "display_sensei.stand_pose.zombie": "Zombie",
        "display_sensei.stand_pose.cancan_a": "Cancan A",
        "display_sensei.stand_pose.cancan_b": "Cancan B",
        "display_sensei.stand_pose.hero": "Hero",
        "display_sensei.frame_rotation.step": "{deg}°",
        "display_sensei.version.v1_21_0": "1.21.0 (oldest)",
        "display_sensei.version.v1_21_0_hint": "The first geometry version with display transforms (Minecraft 1.21.30 and newer). Keeps the older fit_to_frame behaviour, and shelves copy the item frame transforms.",
        "display_sensei.version.v1_21_130": "1.21.130",
        "display_sensei.version.v1_21_130_hint": "Current fit_to_frame behaviour: turning it off no longer draws the item larger than its slot. Shelves still copy the item frame transforms.",
        "display_sensei.version.v1_26_0": "1.26.0",
        "display_sensei.version.v1_26_0_hint": "Minecraft 26.10 fixed the item frame rotation for geometry 1.26.0 and later, but only for blocks drawn with minecraft:geometry.full_block, so it does not change this custom model. Shelves still copy the item frame transforms.",
        "display_sensei.version.v1_26_40": "1.26.40 (recommended)",
        "display_sensei.version.v1_26_40_hint": "Shelves use their own transforms instead of copying the item frame (Minecraft 26.40). Older game versions cannot load the model.",
        "display_sensei.version.from_file": "{version} (from the file)",
        "display_sensei.version.from_file_hint": "The geometry file was saved with this version. It is kept until you choose another one.",
        "display_sensei.armor.wearable_slot_name": "minecraft:wearable slot",
        "display_sensei.armor.worn_here_hint": "Your item is worn here: {slot}.",
        "display_sensei.armor.detected_armor": "Armor piece for {slot}",
        "display_sensei.armor.detected_armor_tip": "Placed on the wearer by its bone names, like vanilla armor.",
        "display_sensei.armor.detected_worn": "Worn in {slot}, placed by its binding",
        "display_sensei.armor.detected_worn_tip": "Its root bone's binding places it, instead of bones named like the wearer's.",
        "display_sensei.armor.detected_worn_elsewhere": "Worn in a slot without a tab here",
        "display_sensei.armor.detected_worn_elsewhere_tip": "A worn item in a slot this tab has no card for, such as slot.armor.body.",
        "display_sensei.armor.detected_held": "Held item, not worn",
        "display_sensei.armor.detected_held_tip": "Choose under Treat as if it is worn.",
        "display_sensei.armor.detected_held_slot": "Held item, also worn in {slot}",
        "display_sensei.armor.detected_unknown": "Not detected as worn: choose under Treat as",
        "display_sensei.armor.detected_unknown_tip": "The pack names no wearable slot, the attachable has no parent_setup, and fewer than two bones are named like the wearer's.",
        "display_sensei.armor.source_saved": "(your choice)",
        "display_sensei.armor.source_pack": "(from your pack)",
        "display_sensei.armor.source_pack_tip": "Read from the item's minecraft:wearable slot or the attachable's parent_setup.",
        "display_sensei.armor.source_file": "(from the attachable file)",
        "display_sensei.armor.source_file_tip": "Read from the attachable file Blockbench opened with this model.",
        "display_sensei.armor.source_bones": "(from the bone names)",
        "display_sensei.armor.source_bones_tip": "No pack says so; the bone names suggest it.",
        "display_sensei.armor.slot_unknown": "a slot not known yet",
        "display_sensei.armor.other_slot": "This item is worn on {tab}.",
        "display_sensei.armor.other_slot_tip": "Its slot is {slot}. The checks and fit offsets are on the {tab} tab.",
        "display_sensei.armor.go_worn_slot": "Open {tab}",
        "display_sensei.armor.go_worn_slot_hint": "Opens Armor > {tab} ({slot}).",
        "display_sensei.armor.kind": "Treat as",
        "display_sensei.armor.kind_hint": "What the model is. Detect reads the item in your pack, the attachable file and the bone names. Your own choice is saved in the project, as one undo step.",
        "display_sensei.armor.kind_auto": "Detect",
        "display_sensei.armor.kind_armor": "Armor piece (bone names)",
        "display_sensei.armor.kind_worn": "Worn item (binding)",
        "display_sensei.armor.kind_held": "Held item",
        "display_sensei.armor.wearer_section": "Preview on a wearer",
        "display_sensei.armor.preview_only_hint": "The wearer, the cameras and the pose test are drawn by Display Sensei around your model. Nothing in this section is saved in the project or exported.",
        "display_sensei.armor.wearer": "Wearer",
        "display_sensei.armor.wearer_hint": "The player or mob the piece is checked on. Its bones, pivots and layers are the game's own numbers.",
        "display_sensei.armor.wearer_shaded": "Drawn shaded: Blockbench has no texture for this wearer.",
        "display_sensei.armor.overlay_show": "Show the wearer",
        "display_sensei.armor.overlay_show_hint": "Draws the wearer around your model while this card is open, in Edit and Paint mode.",
        "display_sensei.armor.overlay_outer_layer": "Skin outer layer",
        "display_sensei.armor.overlay_outer_layer_hint": "Draws the wearer's outer layer (hat, jacket, sleeves, pants). A piece must stand clear of it, or the two flicker into each other.",
        "display_sensei.armor.overlay_xray": "X-ray",
        "display_sensei.armor.overlay_xray_hint": "Draws the wearer see-through, so the parts of your model inside it stay visible.",
        "display_sensei.armor.other_slots": "Other slots",
        "display_sensei.armor.other_slots_hint": "What is drawn in the slots your item is not worn in, to check that the pieces fit together.",
        "display_sensei.armor.other_slots_none": "Nothing",
        "display_sensei.armor.other_slots_grey": "Grey vanilla pieces",
        "display_sensei.armor.other_slots_flat": "Vanilla pieces, textured",
        "display_sensei.armor.flat_texture": "Texture",
        "display_sensei.armor.flat_texture_hint": "A texture of this project for the vanilla pieces in the other slots. They use the vanilla armor layout (64 × 32).",
        "display_sensei.armor.flat_texture_none": "None (shaded)",
        "display_sensei.armor.camera": "Camera",
        "display_sensei.armor.camera_front": "Front",
        "display_sensei.armor.camera_front_hint": "Look at the wearer from the front.",
        "display_sensei.armor.camera_back": "Back",
        "display_sensei.armor.camera_back_hint": "Look at the wearer from behind.",
        "display_sensei.armor.camera_right": "Right",
        "display_sensei.armor.camera_right_hint": "Look at the wearer's right side.",
        "display_sensei.armor.camera_left": "Left",
        "display_sensei.armor.camera_left_hint": "Look at the wearer's left side.",
        "display_sensei.armor.camera_restore": "Your camera",
        "display_sensei.armor.camera_restore_hint": "Puts the camera back where it was before you picked a view.",
        "display_sensei.armor.pose_test": "Pose test",
        "display_sensei.armor.pose_hint": "Poses the wearer and your bones on it. Edit mode only. Ends at the next edit, undo or mode change, or on a second click.",
        "display_sensei.armor.no_poses": "This wearer has no pose tests.",
        "display_sensei.armor.poses_chosen": "{poses}: angles chosen by Display Sensei, not measured in game.",
        "display_sensei.armor.checks_label": "Checks on {wearer}",
        "display_sensei.armor.checks_empty": "No problems found on this wearer.",
        "display_sensei.armor.check_bones": "Bones: {bones}",
        "display_sensei.armor.severity_error": "Error",
        "display_sensei.armor.severity_warning": "Warning",
        "display_sensei.armor.severity_info": "Note",
        "display_sensei.armor.estimate": "Estimate",
        "display_sensei.armor.estimate_hint": "How the game handles this is not measured in game yet, so this check is Display Sensei's estimate.",
        "display_sensei.armor.fix_rename": "Rename",
        "display_sensei.armor.fix_rename_hint": "Renames the bone to the wearer bone's name, so the game places it on that bone. One undo step.",
        "display_sensei.armor.fix_snap_pivot_keep": "Snap pivot, keep cubes",
        "display_sensei.armor.fix_snap_pivot_keep_hint": "Moves the bone's pivot onto vanilla armor's pivot and leaves the cubes where they are. One undo step.",
        "display_sensei.armor.fix_snap_pivot_move": "Snap pivot, move cubes",
        "display_sensei.armor.fix_snap_pivot_move_hint": "Moves the bone's pivot onto vanilla armor's pivot and moves its cubes with it. One undo step.",
        "display_sensei.armor.fix_flatten": "Flatten",
        "display_sensei.armor.fix_flatten_hint": "Moves the bone out of its parent to the top level, keeping its cubes where they are. Optional: the game also finds a nested bone by its name. One undo step.",
        "display_sensei.armor.fix_wrap_pivot_parent": "Wrap in a pivot bone",
        "display_sensei.armor.fix_wrap_pivot_parent_hint": "Puts the bound bone inside a new bone at the wearer's pivot, so its binding places it from there. One undo step.",
        "display_sensei.armor.fit_label": "Fit offsets",
        "display_sensei.armor.fit_intro": "Moves, turns or scales a bone of your model on the wearer without changing the model. Bake writes the offsets into the model.",
        "display_sensei.armor.fit_preview": "Preview the offsets on the wearer",
        "display_sensei.armor.fit_preview_hint": "Shows your bones moved by their fit offsets on the wearer. Preview only: the model changes only when you Bake. It stays on until you untick it or leave this card.",
        "display_sensei.armor.fit_empty": "No bone of your model lands on this slot's wearer bones ({bones}).",
        "display_sensei.armor.fit_position": "Position",
        "display_sensei.armor.fit_target": "(on the wearer's {bone})",
        "display_sensei.armor.fit_reset": "Reset offsets",
        "display_sensei.armor.fit_reset_hint": "Removes every fit offset of this slot. One undo step.",
        "display_sensei.armor.bake": "Bake into model",
        "display_sensei.armor.bake_hint": "Writes the fit offsets into your model: what is inside each bone moves, turns and scales, pivots stay, and the offsets are cleared. One undo step.",
        "display_sensei.armor.facts": "Bedrock facts",
        "display_sensei.armor.fact_flat_icon": "Hand, item frame, ground and inventory show the flat icon.",
        "display_sensei.armor.fact_flat_icon_tip": "In the hand, in item frames, on the ground and in the inventory, the game shows the item's flat icon (minecraft:icon). The 3D model shows only while the item is worn.",
        "display_sensei.armor.fact_first_person": "First person: not measured in game yet.",
        "display_sensei.armor.fact_first_person_tip": "First person: vanilla chestplate sleeves do not show on the first-person arm. Whether a custom piece shows there is not measured in game yet.",
        "display_sensei.armor.fact_slim": "Slim arms can't be detected: check arm pieces on the slim player too.",
        "display_sensei.armor.fact_slim_tip": "The game cannot tell slim arms from wide ones (there is no query for it), and vanilla sleeves stay 4 px wide on slim players. Check arm pieces on the slim player too.",
        "display_sensei.armor.fact_parent_setup": "parent_setup hides only the player's marker bones.",
        "display_sensei.armor.fact_parent_setup_tip": "parent_setup hides only the player's marker bones (helmet, bodyArmor, belt, the arm armor, leggings, boots and socks), which skin packs and the Character Creator use. It never hides the wearer's own head, body or limbs.",
        "display_sensei.armor.fact_trims": "No custom trims, toughness or knockback resistance.",
        "display_sensei.armor.fact_trims_tip": "Bedrock has no fields for custom trim patterns or trim materials, nor for armor toughness or knockback resistance. Vanilla trims can still show on custom armor.",
        "display_sensei.armor.fact_elytra": "An elytra-like piece is a chest piece that does not glide.",
        "display_sensei.armor.fact_elytra_tip": "An elytra-like piece is a chest-slot piece: it is drawn on the body like a chestplate, and it does not glide.",
        "display_sensei.armor.fact_cape": "Capes come from the player's skin or persona, not from an item.",
        "display_sensei.armor.version_26_10": "Player armor uses controller.render.armor.player; baby mobs got armor geometry.",
        "display_sensei.armor.version_26_10_tip": "Player armor attachables use controller.render.armor.player, and baby mobs got their own armor geometry (format 1.26.10).",
        "display_sensei.armor.version_26_20": "Format 1.26.10 and later uses controller.render.armor.v2.",
        "display_sensei.armor.version_26_20_tip": "Attachables of format 1.26.10 and later use controller.render.armor.v2 instead of an updated controller.render.armor, which fixed custom armor that did not render.",
        "display_sensei.armor.version_26_30": "minecraft:wearable no longer overrides max_stack_size.",
        "display_sensei.armor.version_26_30_tip": "From item format 1.26.30, minecraft:wearable in an armor slot no longer overrides the item's own minecraft:max_stack_size.",
        "display_sensei.armor_check.nothing_follows": "No bone follows the wearer: it is drawn at the wearer's feet.",
        "display_sensei.armor_check.nothing_follows_tip": "No bone of this model follows the wearer, so the game draws it at the wearer's feet. Name bones after the wearer's bones ({bones}).",
        "display_sensei.armor_check.slot_empty": "Nothing in this model follows this slot's wearer bones ({bones}).",
        "display_sensei.armor_check.slot_mix": "Also follows {bones}, which belong to another slot.",
        "display_sensei.armor_check.slot_mix_tip": "This model also follows {bones}, which belong to another slot. Those parts show whenever this piece is worn.",
        "display_sensei.armor_check.name_alias": "\"{bone}\" is not an exact wearer bone name: rename it to {target}.",
        "display_sensei.armor_check.name_alias_tip": "\"{bone}\" looks like the wearer's {target}, but the game only matches that exact name (in any case). Rename it to {target}.",
        "display_sensei.armor_check.pivot_delta": "{bone} turns {delta} away from the {wearer}'s {target}.",
        "display_sensei.armor_check.pivot_delta_tip": "{bone} turns at {pivot}; the {wearer}'s {target} turns at {wearer_pivot} ({delta} apart). Blockbench draws the part moved by that difference; what the game does is not measured in game yet.",
        "display_sensei.armor_check.pivot_wearer": "The {wearer}'s {target} pivot is {delta} from vanilla armor's.",
        "display_sensei.armor_check.pivot_wearer_tip": "The {wearer}'s {target} turns at {wearer_pivot}, {delta} from vanilla armor's pivot. Vanilla armor sits the same way on this wearer.",
        "display_sensei.armor_check.reserved_marker": "{bone} has the name of a player skin marker bone.",
        "display_sensei.armor_check.reserved_marker_tip": "{bone} has the name of one of the player's skin marker bones, which the game shows and hides for armor. How it looks on the {wearer} is not measured in game yet.",
        "display_sensei.armor_check.nested_match": "{bone} is inside {parent}; it still follows its own wearer bone.",
        "display_sensei.armor_check.nested_match_tip": "{bone} is inside {parent}. Both still follow their own wearer bones (the name comes before the parent), so this works; flatten it if you prefer a flat list.",
        "display_sensei.armor_check.bound_offset": "{bone} lands {offset} away: put it in a parent at {target}'s pivot.",
        "display_sensei.armor_check.bound_offset_tip": "{bone} is bound to {target} and lands {offset} away from where it is modelled: a bound bone is placed from its parent's pivot, or from [0, 24, 0] at the top level. Put it in a parent at {target}'s pivot.",
        "display_sensei.armor_check.item_slot_binding": "{bone} is bound to the item slot: name it after a wearer bone instead.",
        "display_sensei.armor_check.item_slot_binding_tip": "{bone} is bound to the item slot. Which bone that gives for the chest, legs and feet is not measured in game yet; name the bone after a wearer bone instead.",
        "display_sensei.armor_check.binding_version": "Bindings need geometry format 1.16.0 or later.",
        "display_sensei.armor_check.binding_version_tip": "Bones with a binding need geometry format 1.16.0 or later. Blockbench writes at least that when it saves this model; a geometry file made another way must say so too.",
        "display_sensei.armor_check.clearance_inside": "Part of {bone} sits inside the {wearer}'s skin on {target}.",
        "display_sensei.armor_check.clearance_inside_tip": "Part of {bone} sits inside the {wearer}'s skin on {target} (its skin reaches {layer} px out there), so the skin shows through.",
        "display_sensei.armor_check.clearance_flicker": "A face of {bone} lies on the {wearer}'s skin on {target}: they flicker.",
        "display_sensei.armor_check.clearance_flicker_tip": "A face of {bone} lies exactly on the {wearer}'s skin on {target} ({layer} px out), so the two flicker. Make the part a little larger.",
        "display_sensei.armor_check.clipping": "The {wearer}'s {target} pokes out of {bone} on one side.",
        "display_sensei.armor_check.vanilla_overlap": "A face of {bone} shares a plane with vanilla {slot} armor: they flicker.",
        "display_sensei.armor_check.vanilla_overlap_tip": "A face of {bone} lies in the same plane as vanilla {slot} armor on {target}: worn together, the two flicker.",
        "display_sensei.armor_check.no_parent_setup": "parent_setup does not set {variable} to 0.",
        "display_sensei.armor_check.no_parent_setup_tip": "The attachable does not set {variable} to 0 in its parent_setup, so the player's skin-pack and Character Creator parts can show under this piece. Vanilla armor sets it.",
        "display_sensei.armor_check.target_missing": "The {wearer} has no {target}: {bone} is drawn at its feet.",
        "display_sensei.armor_check.target_missing_tip": "The {wearer} has no {target}, so the game draws {bone} at its feet, where it does not follow the pose. Fine if the piece is meant for other wearers.",
        "display_sensei.armor_check.wearer_hides_armor": "The {wearer}'s entity file sets hide_armor.",
        "display_sensei.armor_check.wearer_hides_armor_tip": "The {wearer}'s entity file sets hide_armor, so the game may draw no armor on it at all. Whether that also hides a custom piece is not measured in game yet.",
        "display_sensei.wearer.player_wide": "Player (wide arms)",
        "display_sensei.wearer.player_slim": "Player (slim arms)",
        "display_sensei.wearer.armor_stand": "Armor Stand",
        "display_sensei.wearer.zombie": "Zombie",
        "display_sensei.wearer.husk": "Husk",
        "display_sensei.wearer.drowned": "Drowned",
        "display_sensei.wearer.skeleton": "Skeleton",
        "display_sensei.wearer.stray": "Stray",
        "display_sensei.wearer.wither_skeleton": "Wither Skeleton",
        "display_sensei.wearer.bogged": "Bogged",
        "display_sensei.wearer.piglin": "Piglin",
        "display_sensei.wearer.piglin_brute": "Piglin Brute",
        "display_sensei.wearer.zombie_pigman": "Zombified Piglin",
        "display_sensei.wearer.pillager": "Pillager",
        "display_sensei.wearer.vindicator": "Vindicator",
        "display_sensei.wearer.zombie_villager": "Zombie Villager",
        "display_sensei.wearer.baby_zombie": "Baby Zombie",
        "display_sensei.wearer.copper_golem": "Copper Golem",
        "display_sensei.pose_test.walk": "Walk",
        "display_sensei.pose_test.sneak": "Sneak",
        "display_sensei.pose_test.arms_raised": "Arms raised",
        "display_sensei.pose_test.look": "Head turned",
        "display_sensei.pose_test.sit": "Sit",
        "display_sensei.undo.edit_slot": "Edit display slot",
        "display_sensei.undo.reset_slot": "Reset display slot to Bedrock default",
        "display_sensei.undo.stop_inheriting": "Write display slot explicitly",
        "display_sensei.undo.mirror_slot": "Mirror display slot from other hand",
        "display_sensei.undo.apply_preset": "Apply display preset",
        "display_sensei.undo.fit_to_frame": "Change GUI fit to frame",
        "display_sensei.undo.geometry_version": "Change geometry version",
        "display_sensei.undo.same_pose_slot": "Copy display slot pose from other hand",
        "display_sensei.undo.turn_slot": "Turn display slot 180°",
        "display_sensei.undo.turn_item": "Turn display slot about the item's own axis",
        "display_sensei.undo.tidy_rotation": "Tidy display slot rotation",
        "display_sensei.undo.match_first_person": "Match first person to third person",
        "display_sensei.undo.reset_channel": "Reset display channel to Bedrock default",
        "display_sensei.undo.armor_kind": "Set what the model is",
        "display_sensei.undo.armor_rename": "Rename bone after the wearer's bone",
        "display_sensei.undo.armor_pivot": "Put pivot on vanilla armor's pivot",
        "display_sensei.undo.armor_flatten": "Move bone to the top level",
        "display_sensei.undo.armor_wrap": "Add pivot parent for bound bone",
        "display_sensei.undo.armor_fit": "Change fit offset",
        "display_sensei.undo.armor_fit_reset": "Reset fit offsets",
        "display_sensei.undo.armor_bake": "Bake fit offsets into the model",
        "display_sensei.hold.state_same": "Same as right",
        "display_sensei.hold.state_own": "Own hold",
        "display_sensei.hold.state_same_hint": "The off hand plays the main hand's numbers. Bedrock mirrors nothing for 3D items.",
        "display_sensei.hold.state_own_hint": "The off hand has numbers of its own, written as c.item_slot == 'off_hand' ? … : … in the same hold animation.",
        "display_sensei.hold.same_as_main": "Same as right hand",
        "display_sensei.hold.same_as_main_hint": "Untick to give the off hand (left hand) its own hold. Display Sensei writes it the way the vanilla shield does: a c.item_slot check inside the same animation.",
        "display_sensei.hold.animation_hint": "The hold animation the game plays here.",
        "display_sensei.hold.bone_hint": "The bone the hold moves: the root bone bound to the hand.",
        "display_sensei.hold.position": "Position",
        "display_sensei.hold.position_label": "Position (pixels)",
        "display_sensei.hold.position_slider_hint": "Move {axis} (−48 to 48 px; type any other value)",
        "display_sensei.hold.reset_channel_hint": "Set {channel} back to {values}: the bone as modelled, which is what the game shows with no hold.",
        "display_sensei.hold.mirror_from": "Mirror image of {hand}",
        "display_sensei.hold.mirror_hint": "Copy the {hand}'s hold mirrored left to right (position X, rotation Y and Z flipped).",
        "display_sensei.hold.same_pose_hint": "Copy the {hand}'s hold as it is: the item faces the same way in both hands.",
        "display_sensei.hold.preset_scope_view": "This view",
        "display_sensei.hold.preset_scope_both": "1st and 3rd person",
        "display_sensei.hold.held_by": "Held by",
        "display_sensei.hold.held_by_hint": "Preview only. The holder's arm takes its Bedrock holding pose.",
        "display_sensei.hold.first_person_view": "From the eyes at Bedrock's first-person field of view.",
        "display_sensei.hold.first_person_view_tip": "Camera at eye height (27.41 px) with a 70.25° field of view at 16:9; the item sits on the vanilla first-person arm (player_firstperson.animation.json). Not measured in game yet.",
        "display_sensei.hold.estimate": "Estimate",
        "display_sensei.hold.estimate_hint": "Not measured in game yet.",
        "display_sensei.hold.preview_only_hint": "The holder, the cameras and the pictures are never saved or written.",
        "display_sensei.hold.reset_view_hint": "Show this view's camera again.",
        "display_sensei.hold.edit_mode": "Edit mode",
        "display_sensei.hold.edit_mode_hint": "Holds are shown on the holder and edited in Edit mode.",
        "display_sensei.hold.note_animate": "Shown and edited in Edit mode.",
        "display_sensei.hold.note_animate_tip": "Animate mode plays your attachable's animations together; Display Sensei shows one view at a time in Edit mode.",
        "display_sensei.hold.note_missing": "Your attachable plays no hold here yet.",
        "display_sensei.hold.note_missing_tip": "Display Sensei keeps this hold in the project. Write or export it, then add it to your attachable's animations and scripts.animate (Output tab).",
        "display_sensei.hold.note_new": "No attachable file found: holds stay in this project.",
        "display_sensei.hold.note_new_tip": "Copy or export them from the Output tab, with the lines your attachable needs to play them.",
        "display_sensei.hold.note_stacked": "Several animations move {bone} here: use Animate mode.",
        "display_sensei.hold.note_stacked_tip": "In this view more than one animation of your attachable moves {bone}, and the game adds them up. Display Sensei edits a hold only when one animation moves the item.",
        "display_sensei.hold.note_controller": "An animation controller moves the item here: use Animate mode.",
        "display_sensei.hold.note_controller_tip": "Your attachable plays its holds through an animation controller, so which animation plays depends on its states. Edit them in Animate mode.",
        "display_sensei.hold.note_animated": "Animated or Molang: edit it in Animate mode.",
        "display_sensei.hold.note_animated_tip": "Display Sensei edits a hold that is one keyframe at 0 with plain numbers, c.is_first_person checks and c.item_slot checks. Anything else stays as it is.",
        "display_sensei.hold.note_molang": "Uses Molang: edit it in Animate mode.",
        "display_sensei.hold.note_no_bone": "Add a bone to the model to set its holds.",
        "display_sensei.hold.note_no_bone_tip": "A hold animation moves a bone. A held 3D item has one root bone bound to the hand.",
        "display_sensei.hold.view_first_person": "1st person",
        "display_sensei.hold.view_third_person": "3rd person",
        "display_sensei.hold.worn_title": "Worn, not held",
        "display_sensei.hold.worn": "The game shows this item's icon in the hand.",
        "display_sensei.hold.worn_tip": "The item is worn in an armor slot, so its attachable draws it on the wearer and the hand shows the flat icon. Its fit is on the Armor tab.",
        "display_sensei.hold.go_armor": "Open Armor > {tab}",
        "display_sensei.hold.go_armor_hint": "Show the Armor tab for {slot}.",
        "display_sensei.hold.copy_hint": "Copy this hold's numbers.",
        "display_sensei.hold.paste_hint": "Paste the copied numbers into this hold, as one undo step.",
        "display_sensei.hold_check.no_hand_binding": "No bone is bound to the hand: the item stays at the holder's feet.",
        "display_sensei.hold_check.no_hand_binding_tip": "A held 3D item needs a root bone with the binding q.item_slot_to_bone_name(c.item_slot). Without it the game draws the model at the holder's root.",
        "display_sensei.hold_check.loose_roots": "Only {bone} follows the hand; {others} stay at the holder's feet.",
        "display_sensei.hold_check.loose_roots_tip": "Parts outside the bone bound to the hand are drawn at the holder's root.",
        "display_sensei.hold_check.far_from_hand": "{view}: {bone}'s pivot sits {distance} px from the hand.",
        "display_sensei.hold_check.far_from_hand_tip": "A bound root bone is placed relative to [0, 24, 0], so a pivot at [0, 0, 0] lands 24 px below the hand unless the hold lifts it (the Item Wizard lifts it 22 to 24 px). A pivot at [0, 24, 0] needs no lift. Not measured in game yet.",
        "display_sensei.hold_check.fix_bind_root": "Bind {bone} to the hand",
        "display_sensei.hold_check.fix_bind_root_hint": "Sets its binding to q.item_slot_to_bone_name(c.item_slot), as one undo step. Ctrl+S saves it into the model.",
        "display_sensei.hold_check.fix_move_into_bound": "Move them into {bone}",
        "display_sensei.hold_check.fix_move_into_bound_hint": "Moves the other parts into the bound bone, as one undo step. Nothing moves on screen.",
        "display_sensei.hold_preset.group_file": "Your file",
        "display_sensei.hold_preset.group_item_wizard": "Item Wizard",
        "display_sensei.hold_preset.group_vanilla": "Vanilla examples",
        "display_sensei.hold_preset.file": "Your file's holds",
        "display_sensei.hold_preset.file_note": "The holds as your hold file has them now.",
        "display_sensei.hold_preset.item_wizard_item": "Item hold",
        "display_sensei.hold_preset.item_wizard_item_note": "The Item Wizard's canned hold for items like Iron Ingot and Apple. Positions follow your bone's pivot.",
        "display_sensei.hold_preset.item_wizard_tool": "Tool hold",
        "display_sensei.hold_preset.item_wizard_tool_note": "The Item Wizard's canned hold for tools like Sword and Pickaxe. Positions follow your bone's pivot.",
        "display_sensei.hold_preset.vanilla_spyglass": "Spyglass",
        "display_sensei.hold_preset.vanilla_spyglass_note": "The vanilla spyglass hold (animations/spyglass.animation.json). Positions follow your bone's pivot.",
        "display_sensei.hold_preset.vanilla_trident": "Trident",
        "display_sensei.hold_preset.vanilla_trident_note": "The vanilla trident's resting holds (animations/trident.animation.json). Positions follow your bone's pivot.",
        "display_sensei.hold_write.title": "Hold animations",
        "display_sensei.hold_write.title_tip": "The first- and third-person holds of this 3D item. Write display changes only their position, rotation and scale in your hold file. It never writes the attachable, behavior pack files, manifests or texts.",
        "display_sensei.hold_write.write": "Write display",
        "display_sensei.hold_write.write_hint": "Write the hold numbers into the hold file. It asks first.",
        "display_sensei.hold_write.restore": "Restore the file",
        "display_sensei.hold_write.restore_hint": "Put the hold file back as it was before Display Sensei first wrote it.",
        "display_sensei.hold_write.state_pending": "{count} values not written yet",
        "display_sensei.hold_write.state_written": "written",
        "display_sensei.hold_write.state_same": "same as this project",
        "display_sensei.hold_write.state_missing": "not found",
        "display_sensei.hold_write.state_changed": "changed outside Display Sensei",
        "display_sensei.hold_write.changed": "The hold file changed since Display Sensei wrote it: write again?",
        "display_sensei.hold_write.changed_tip": "A wizard export, for example, rewrites the hold file with its own numbers. Your holds are still in this project; Write display puts them back.",
        "display_sensei.hold_write.no_file": "No hold file found: Write display asks for a file, or use Copy or Export.",
        "display_sensei.hold_write.no_file_tip": "Save it in your resource pack's animations folder and list the holds in your attachable.",
        "display_sensei.hold_write.skipped": "Some hold channels use Molang that Display Sensei does not write.",
        "display_sensei.hold_write.skipped_tip": "Save those with Blockbench's Save animation in Animate mode.",
        "display_sensei.hold_write.json_label": "Animation file",
        "display_sensei.hold_write.json_tip": "The hold animations as Display Sensei would write a new file. Copy or export it when your pack has no hold file.",
        "display_sensei.hold_write.empty": "No hold values yet.",
        "display_sensei.hold_write.export_hint": "Save the animation file.",
        "display_sensei.hold_write.attachable_lines": "Copy attachable lines",
        "display_sensei.hold_write.attachable_lines_hint": "Your attachable does not play these holds yet: copy the animations and scripts.animate lines to add to it.",
        "display_sensei.hold_write.confirm_title": "Write display",
        "display_sensei.hold_write.confirm_message": "Write the hold numbers (position, rotation, scale) into:\n\n{paths}\n\nEverything else in the file stays as it is. The file as it is now is kept in this project, so you can restore it.",
        "display_sensei.hold_write.confirm_write": "Write",
        "display_sensei.hold_write.choose_file": "Choose another file…",
        "display_sensei.hold_write.conflict_title": "The hold file changed",
        "display_sensei.hold_write.conflict_message": "{path} changed since Display Sensei last read or wrote it, for example by a wizard export.",
        "display_sensei.hold_write.conflict_overwrite": "Overwrite only my hold values",
        "display_sensei.hold_write.conflict_load": "Load the file's values",
        "display_sensei.hold_write.file_type": "Bedrock animation",
        "display_sensei.hold_write.restore_title": "Restore the hold file",
        "display_sensei.hold_write.restore_message": "Write {path} back as it was before Display Sensei first wrote it?",
        "display_sensei.hold_write.restore_confirm": "Restore",
        "display_sensei.message.hold_written": "Hold numbers written into {file}.",
        "display_sensei.message.hold_nothing": "Your hold file already has these holds.",
        "display_sensei.message.hold_no_file": "No hold file to write into. Use Copy or Export.",
        "display_sensei.message.hold_missing_file": "The hold file was not found.",
        "display_sensei.message.hold_unreadable": "The hold file could not be read.",
        "display_sensei.message.hold_failed": "Could not write the hold file.",
        "display_sensei.message.hold_loaded": "Loaded the hold values from the file.",
        "display_sensei.message.hold_desktop_only": "Writing files needs the Blockbench desktop app.",
        "display_sensei.message.hold_restored": "The hold file is back as it was.",
        "display_sensei.message.hold_copied": "Hold copied. Pick another hold and press Paste.",
        "display_sensei.message.hold_nothing_to_paste": "Nothing to paste yet. Copy a hold first.",
        "display_sensei.message.hold_preset_failed": "This preset could not be applied here.",
        "display_sensei.message.hold_matched": "1st person now follows 3rd person. Check it in game.",
        "display_sensei.message.hold_matched_hand": "1st person follows 3rd person in the {hand}. The {kept} kept its 1st person: its 3rd person did not change.",
        "display_sensei.message.hold_nothing_to_match": "3rd person has not changed from the starting pair, so 1st person was left as it is.",
        "display_sensei.message.hold_match_read_only": "1st person uses Molang or keyframes here: edit it in Animate mode.",
        "display_sensei.message.hold_clamped": "Only partly matched: a value reached Display Sensei's limits.",
        "display_sensei.message.hold_match_from_file": "Started from your file's holds.",
        "display_sensei.message.hold_match_from_tool": "Started from the Item Wizard tool hold (no hold file).",
        "display_sensei.message.hold_json_copied": "Copied the animation file.",
        "display_sensei.message.hold_attachable_lines_copied": "Copied the attachable lines.",
        "display_sensei.undo.hold_edit": "Edit hold",
        "display_sensei.undo.hold_reset_channel": "Reset hold channel",
        "display_sensei.undo.hold_off_hand_same": "Off hand uses the main hand's hold",
        "display_sensei.undo.hold_off_hand_own": "Off hand gets its own hold",
        "display_sensei.undo.hold_mirror": "Mirror hold from other hand",
        "display_sensei.undo.hold_same_pose": "Copy hold from other hand",
        "display_sensei.undo.hold_turn_item": "Turn held item about its own axis",
        "display_sensei.undo.hold_turn": "Turn held item 180°",
        "display_sensei.undo.hold_tidy_rotation": "Tidy hold rotation",
        "display_sensei.undo.hold_paste": "Paste hold",
        "display_sensei.undo.hold_preset": "Apply hold preset",
        "display_sensei.undo.hold_match": "Match 1st person hold to 3rd person",
        "display_sensei.undo.hold_load_file": "Load holds from file",
        "display_sensei.undo.hold_bind_root": "Bind bone to the hand",
        "display_sensei.undo.hold_move_into_bone": "Move parts into the bound bone",
        "display_sensei.hold_write.target": "Writes into {file}, the file you chose.",
        "display_sensei.hold_write.target_tip": "Write display writes the holds into this file instead of the hold file found in your pack.",
        "display_sensei.hold_write.clear_target": "Use the pack's hold file",
        "display_sensei.hold_write.clear_target_hint": "Write into the hold file found in your pack again."
    }
};

const PLUGIN_LANGUAGE_STORAGE_KEY = 'display_sensei_plugin_language';

function addPluginTranslations() {
    for (let [code, table] of Object.entries(DS_TRANSLATIONS)) {
        Language.addTranslations(code, table);
    }
    return {
        delete() {
            for (let table of Object.values(DS_TRANSLATIONS)) {
                for (let [key, text] of Object.entries(table)) {
                    if (Language.data[key] === text) delete Language.data[key];
                }
            }
        }
    };
}

function i18n(key) {
    return tl(key);
}

function i18nFormat(key, values) {
    let text = i18n(key);
    let entries = values && typeof values === 'object' ? Object.entries(values) : [];
    entries.forEach(([name, value]) => {
        text = text.split(`{${name}}`).join(String(value));
    });
    return text;
}

// ---- src/util.js ----

// =========================
// Cleanup registry
// =========================
const LOG_PREFIX = '[Display Sensei]';

const trackedDeletables = [];

function track(deletable) {
    if (deletable && typeof deletable.delete === 'function') {
        trackedDeletables.push(deletable);
    }
    return deletable;
}

const MODULE_INSTALLERS = [];

function registerModuleInstaller(name, install) {
    MODULE_INSTALLERS.push({ name, install });
}

function installModules() {
    for (let module of MODULE_INSTALLERS) {
        track(module.install());
    }
}

function disposeTracked() {
    while (trackedDeletables.length) {
        let deletable = trackedDeletables.pop();
        try {
            deletable.delete();
        } catch (error) {
            console.warn(LOG_PREFIX, 'A cleanup step failed:', error);
        }
    }
}

function deleteAll(deletables) {
    while (deletables.length) {
        deletables.pop().delete();
    }
}

function createDeletables(creators) {
    let created = [];
    try {
        for (let create of creators) {
            created.push(create());
        }
    } catch (error) {
        deleteAll(created);
        throw error;
    }
    return {
        delete() {
            deleteAll(created);
        }
    };
}

function guardListener(name, listener) {
    return function(event) {
        try {
            listener(event);
        } catch (error) {
            console.warn(LOG_PREFIX, `The ${name} hook failed:`, error);
        }
    };
}

function guardVetoListener(name, listener) {
    return function(event) {
        try {
            return listener(event);
        } catch (error) {
            console.warn(LOG_PREFIX, `The ${name} hook failed:`, error);
            return undefined;
        }
    };
}

// =========================
// Wrapping Blockbench functions
// =========================
function wrapMethod(object, name, replacement) {
    let original = object[name];
    let active = true;
    let wrapper = function(...args) {
        if (!active) return original.apply(this, args);
        return replacement.call(this, original, args);
    };
    object[name] = wrapper;
    return {
        delete() {
            active = false;
            if (object[name] === wrapper) {
                object[name] = original;
            }
        }
    };
}

function withTemporaryValue(object, key, value, fn) {
    let hadKey = Object.prototype.hasOwnProperty.call(object, key);
    let previous = object[key];
    object[key] = value;
    try {
        return fn();
    } finally {
        if (hadKey) {
            object[key] = previous;
        } else {
            delete object[key];
        }
    }
}

// =========================
// Values
// =========================
function cloneJson(value) {
    return JSON.parse(JSON.stringify(value));
}

function isPlainObject(value) {
    return !!value && typeof value === 'object' && !Array.isArray(value);
}

function roundToFour(value) {
    return Math.round(value * 10000) / 10000 + 0;
}

function getFileBaseName(path) {
    return String(path || '').split(/[\\/]/).pop();
}

// =========================
// Messages
// =========================
const QUICK_MESSAGE_MS = 3000;

function showMessage(key) {
    Blockbench.showQuickMessage(i18n(key), QUICK_MESSAGE_MS);
}

const NOTIFICATION_MS = 10000;

function showNotification(id, text) {
    Blockbench.showToastNotification({ id: `display_sensei_${id}`, text, icon: 'info', expire: NOTIFICATION_MS });
}

// =========================
// Route detection
// =========================
const BLOCK_FORMAT_ID = 'bedrock_block';
const ENTITY_FORMAT_ID = 'bedrock';
const ATTACHABLE_FORMAT_ID = ENTITY_FORMAT_ID;
const BEDROCK_FORMAT_IDS = [BLOCK_FORMAT_ID, ENTITY_FORMAT_ID];

function getFormatId() {
    return Format ? Format.id : '';
}

function isEntityFormat() {
    return getFormatId() === ENTITY_FORMAT_ID;
}

function readBlockbenchEntityKind(project) {
    let manager = project && project.BedrockEntityManager;
    let type = manager && manager.client_entity && manager.client_entity.type;
    if (type === 'attachable') return 'attachable';
    if (type === 'client_entity') return 'entity';
    return null;
}

function getBedrockEntityKind(project = Project) {
    if (!project || !project.format || project.format.id !== ENTITY_FORMAT_ID) return 'unknown';
    let blockbenchKind = readBlockbenchEntityKind(project);
    if (blockbenchKind) return blockbenchKind;
    let linked = getLinkedEntityKind(project);
    if (linked) return linked;
    if (isProjectTrackedByWizard('entity', project)) return 'entity';
    if (isProjectTrackedByWizard('item', project)) return 'attachable';
    return 'unknown';
}

function getRoute() {
    let formatId = getFormatId();
    if (formatId === BLOCK_FORMAT_ID) return 'block';
    if (formatId === ENTITY_FORMAT_ID) return getBedrockEntityKind() === 'entity' ? 'entity' : 'attachable';
    return 'none';
}

function canEditAttachable() {
    return !!Project && getRoute() === 'attachable' && !Modes.animate;
}

// ---- src/bedrock_spec.js ----

// =========================
// Bedrock display slots
// =========================
const BEDROCK_SLOTS = [
    {
        id: 'thirdperson_righthand', bedrockKey: 'thirdperson_righthand', label: 'display_sensei.context.thirdperson_righthand',
        subtabs: ['third_back', 'third_front'], hand: 'right',
        attachableKey: 'third_person', attachableLabel: 'display_sensei.context.attachable_third_person',
        support: { block: 'edit', attachable: 'edit', entity: 'mob' }
    },
    {
        id: 'thirdperson_lefthand', bedrockKey: 'thirdperson_lefthand', label: 'display_sensei.context.thirdperson_lefthand',
        subtabs: ['third_back', 'third_front'], hand: 'left',
        attachableKey: 'third_person', attachableLabel: 'display_sensei.context.attachable_third_person',
        support: { block: 'edit', attachable: 'edit', entity: 'mob' }
    },
    {
        id: 'firstperson_righthand', bedrockKey: 'firstperson_righthand', label: 'display_sensei.context.firstperson_righthand',
        subtabs: ['first_person'], hand: 'right',
        attachableKey: 'first_person', attachableLabel: 'display_sensei.context.attachable_first_person',
        support: { block: 'edit', attachable: 'edit', entity: 'mob' }
    },
    {
        id: 'firstperson_lefthand', bedrockKey: 'firstperson_lefthand', label: 'display_sensei.context.firstperson_lefthand',
        subtabs: ['first_person'], hand: 'left',
        attachableKey: 'first_person', attachableLabel: 'display_sensei.context.attachable_first_person',
        support: { block: 'edit', attachable: 'edit', entity: 'mob' }
    },
    {
        id: 'ground', bedrockKey: 'ground', label: 'display_sensei.context.ground',
        subtabs: ['ground'],
        support: { block: 'edit', attachable: 'icon', entity: 'mob' }
    },
    {
        id: 'fixed', bedrockKey: 'fixed', label: 'display_sensei.context.fixed',
        subtabs: ['item_frame'],
        support: { block: 'edit', attachable: 'icon', entity: 'mob' }
    },
    {
        id: 'head', bedrockKey: 'head', label: 'display_sensei.context.head',
        subtabs: ['head', 'slot.armor.head'],
        support: { block: 'edit', attachable: 'worn_pointer', entity: 'mob' }
    },
    {
        id: 'gui', bedrockKey: 'gui', label: 'display_sensei.context.gui',
        subtabs: ['gui'],
        support: { block: 'edit', attachable: 'icon', entity: 'mob' }
    },
    {
        id: 'embedded', bedrockKey: 'embedded', label: 'display_sensei.context.embedded',
        subtabs: ['flower_pot'],
        support: { block: 'edit', attachable: 'block_only', entity: 'mob' }
    },
    {
        id: 'on_shelf', bedrockKey: 'shelf', label: 'display_sensei.context.shelf',
        subtabs: ['shelf'],
        support: { block: 'edit', attachable: 'block_only', entity: 'mob' }
    }
];

function findBedrockSlot(slotId) {
    return BEDROCK_SLOTS.find(slot => slot.id === slotId) || null;
}

function findSlotForContext(subtabId, handId) {
    return BEDROCK_SLOTS.find(slot => slot.subtabs.includes(subtabId) && (!slot.hand || slot.hand === handId)) || null;
}

// =========================
// Schema ranges
// =========================
const SLOT_RANGES = Object.freeze({
    translation: Object.freeze([-80, 80]),
    rotation: Object.freeze([-360, 360]),
    scale: Object.freeze([0, 4]),
    rotation_pivot: Object.freeze([-80, 80]),
    scale_pivot: Object.freeze([-80, 80])
});

const SLOT_CHANNELS = Object.keys(SLOT_RANGES);

const FALLBACK_FIELDS = ['rotation', 'translation', 'scale'];

function clampToRange(value, range) {
    return Math.min(range[1], Math.max(range[0], value));
}

// =========================
// Engine defaults
// =========================
function getEngineDefaults() {
    return JSON.parse(JSON.stringify(DisplayMode.bedrock_defaults || {}));
}

// =========================
// Geometry format versions
// =========================
const GEOMETRY_VERSIONS = [
    { version: '1.21.0', label: 'display_sensei.version.v1_21_0', hint: 'display_sensei.version.v1_21_0_hint' },
    { version: '1.21.130', label: 'display_sensei.version.v1_21_130', hint: 'display_sensei.version.v1_21_130_hint' },
    { version: '1.26.0', label: 'display_sensei.version.v1_26_0', hint: 'display_sensei.version.v1_26_0_hint' },
    { version: '1.26.40', label: 'display_sensei.version.v1_26_40', hint: 'display_sensei.version.v1_26_40_hint' }
];

const DEFAULT_GEOMETRY_VERSION = '1.26.40';
const MIN_GEOMETRY_VERSION = '1.21.0';
const FIT_TO_FRAME_GEOMETRY_VERSION = '1.21.130';
const ITEM_FRAME_GEOMETRY_VERSION = '1.26.0';
const SHELF_GEOMETRY_VERSION = '1.26.40';

function isGeometryVersionString(value) {
    return typeof value === 'string' && /^\d+(\.\d+)*$/.test(value);
}

function isSupportedGeometryVersion(value) {
    return isGeometryVersionString(value) && VersionUtil.compare(value, '>=', MIN_GEOMETRY_VERSION);
}

function laterGeometryVersion(a, b) {
    return VersionUtil.compare(a, '>=', b) ? a : b;
}

function earlierGeometryVersion(a, b) {
    return VersionUtil.compare(a, '<=', b) ? a : b;
}

function getGeometryVersionFloor(itemDisplayTransforms) {
    if (!itemDisplayTransforms || !Object.keys(itemDisplayTransforms).length) return null;
    if (itemDisplayTransforms.shelf) return SHELF_GEOMETRY_VERSION;
    return MIN_GEOMETRY_VERSION;
}

// =========================
// Left hand
// =========================
const LEFT_HAND_RULE = 'mirror';

// =========================
// Bedrock presets
// =========================
const PRESET_GROUPS = [
    { id: 'bedrock', label: 'display_sensei.preset_group.bedrock' },
    { id: 'vanilla', label: 'display_sensei.preset_group.vanilla' }
];

const CALIBRATION_IDS = ['item_hold', 'tool_hold'];

const CALIBRATED_SWORD = {
    thirdperson_righthand: { rotation: [0, 90, 0], translation: [0, 3.25, 1.75], scale: [0.925, 0.925, 0.925] },
    thirdperson_lefthand: { rotation: [0, 90, 0], translation: [0, 3.25, 1.75], scale: [0.925, 0.925, 0.925] },
    ground: { rotation: [0, 0, 0], translation: [0, 3, 0], scale: [0.61, 0.61, 0.61] },
    fixed: { rotation: [0, 0, 0], translation: [0, 0, 0], scale: [1.025, 1.025, 1.025] },
    gui: { rotation: [30, -1, 0], translation: [0, 0, 0], scale: [1.025, 1.025, 1.025], fit_to_frame: true },
    embedded: { rotation: [0, 0, -180], translation: [0, -1.5, 0], scale: [0.75, 0.75, 0.75] },
    on_shelf: { rotation: [0, 0, 0], translation: [0, 1.25, 0], scale: [1.3, 1.3, 1.3] }
};

const CALIBRATED_SWORD_HANDS = {
    thirdperson_righthand: CALIBRATED_SWORD.thirdperson_righthand,
    thirdperson_lefthand: CALIBRATED_SWORD.thirdperson_lefthand
};

const BEDROCK_PRESETS = [
    {
        id: 'bedrock_defaults',
        label: 'display_sensei.preset.bedrock_defaults',
        noteKey: 'display_sensei.preset_note.bedrock_defaults',
        group: 'bedrock',
        confidence: 'engine',
        geometryVersion: null,
        inherit: true
    },
    {
        id: 'item_hold',
        label: 'display_sensei.preset.item_hold',
        noteKey: 'display_sensei.preset_note.item_hold',
        calibratedNoteKey: 'display_sensei.preset_note.item_hold_calibrated',
        group: 'bedrock',
        confidence: 'user',
        geometryVersion: null,
        calibration: 'item_hold'
    },
    {
        id: 'tool_hold',
        label: 'display_sensei.preset.tool_hold',
        noteKey: 'display_sensei.preset_note.tool_hold',
        calibratedNoteKey: 'display_sensei.preset_note.tool_hold_calibrated',
        group: 'bedrock',
        confidence: 'calibrated',
        geometryVersion: null,
        calibration: 'tool_hold',
        matchFirstPerson: true,
        areas: CALIBRATED_SWORD_HANDS
    },
    {
        id: 'rod_hold',
        label: 'display_sensei.preset.rod_hold',
        noteKey: 'display_sensei.preset_note.rod_hold',
        calibratedNoteKey: 'display_sensei.preset_note.rod_hold_calibrated',
        group: 'bedrock',
        confidence: 'calibrated',
        geometryVersion: null,
        calibration: 'tool_hold',
        matchFirstPerson: true,
        areas: CALIBRATED_SWORD_HANDS
    },
    {
        id: 'sword_calibration',
        label: 'display_sensei.preset.sword_calibration',
        noteKey: 'display_sensei.preset_note.sword_calibration',
        group: 'bedrock',
        confidence: 'calibrated',
        geometryVersion: null,
        matchFirstPerson: true,
        areas: CALIBRATED_SWORD
    },
    {
        id: 'armor_stand_statue',
        label: 'display_sensei.preset.armor_stand_statue',
        noteKey: 'display_sensei.preset_note.armor_stand_statue',
        group: 'bedrock',
        confidence: 'derived',
        geometryVersion: null,
        standHands: 'none',
        areas: {
            head: { rotation: [0, 0, 0], translation: [0, -32, 0], scale: [1.6, 1.6, 1.6] }
        }
    },
    {
        id: 'vanilla_shelf_mushroom',
        label: 'display_sensei.preset.vanilla_shelf_mushroom',
        noteKey: 'display_sensei.preset_note.vanilla_shelf_mushroom',
        group: 'vanilla',
        confidence: 'vanilla',
        geometryVersion: '1.21.0',
        areas: {
            firstperson_righthand: { rotation: [0, 45, 0], translation: [0, 0, 0], scale: [0.5, 0.5, 0.5] },
            firstperson_lefthand: { rotation: [0, 45, 0], translation: [0.25, 0, 0], scale: [0.5, 0.5, 0.5] },
            thirdperson_righthand: { rotation: [53, 0, 0], translation: [0, 2.25, 0.25], scale: [0.375, 0.375, 0.375] },
            thirdperson_lefthand: { rotation: [53, 0, 0], translation: [0, 2.25, 0.25], scale: [0.375, 0.375, 0.375] },
            head: { rotation: [0, 0, 0], translation: [0, -4.75, -13.75], scale: [1, 1, 1] },
            gui: { rotation: [30, 225, 0], translation: [3.25, -3, 0], scale: [1, 1, 1], fit_to_frame: false },
            ground: { rotation: [0, 0, 0], translation: [0, 2.55, -1.35], scale: [0.3, 0.3, 0.3] },
            fixed: { rotation: [0, 0, 0], translation: [0, -1, -6.75], scale: [1, 1, 1] }
        }
    },
    {
        id: 'vanilla_shelf_mushroom_large',
        label: 'display_sensei.preset.vanilla_shelf_mushroom_large',
        noteKey: 'display_sensei.preset_note.vanilla_shelf_mushroom_large',
        group: 'vanilla',
        confidence: 'vanilla',
        geometryVersion: '1.21.0',
        areas: {
            firstperson_righthand: { rotation: [0, 45, 0], translation: [0, 0, 0], scale: [0.5, 0.5, 0.5] },
            firstperson_lefthand: { rotation: [0, 32, 0], translation: [2.75, 0, -0.25], scale: [0.5, 0.5, 0.5] },
            thirdperson_righthand: { rotation: [53, 0, 0], translation: [0, 2.5, 0.25], scale: [0.375, 0.375, 0.375] },
            thirdperson_lefthand: { rotation: [53, 0, 0], translation: [0, 2.5, 0.25], scale: [0.375, 0.375, 0.375] },
            head: { rotation: [0, 0, 0], translation: [0, 7.75, -2.75], scale: [1, 1, 1] },
            gui: { rotation: [30, 225, 0], translation: [1.75, -1.75, 0], scale: [0.85, 0.85, 0.85], fit_to_frame: true },
            ground: { rotation: [0, 0, 0], translation: [0, 2.55, -1.35], scale: [0.3, 0.3, 0.3] },
            fixed: { rotation: [0, 0, 0], translation: [0, -1, -6.75], scale: [1, 1, 1] }
        }
    },
    {
        id: 'vanilla_straw_bed',
        label: 'display_sensei.preset.vanilla_straw_bed',
        noteKey: 'display_sensei.preset_note.vanilla_straw_bed',
        group: 'vanilla',
        confidence: 'vanilla',
        geometryVersion: '1.26.50',
        areas: {
            firstperson_righthand: { rotation: [30, 340, 0], translation: [0, 3, 0], scale: [0.375, 0.375, 0.375] },
            firstperson_lefthand: { rotation: [30, 340, 0], translation: [0, 3, 0], scale: [0.375, 0.375, 0.375] },
            thirdperson_righthand: { rotation: [30, 340, 0], translation: [0, 3, -2], scale: [0.23, 0.23, 0.23] },
            thirdperson_lefthand: { rotation: [30, 340, 0], translation: [0, 3, -2], scale: [0.23, 0.23, 0.23] },
            head: { rotation: [0, 0, 0], translation: [0, 10, -8], scale: [1, 1, 1] },
            gui: { rotation: [30, 340, 0], translation: [2, 3, 0], scale: [0.5325, 0.5325, 0.5325], fit_to_frame: true },
            ground: { rotation: [0, 180, 0], translation: [0, 1, 2], scale: [0.25, 0.25, 0.25] },
            fixed: { rotation: [270, 180, 0], translation: [0, 4, -2], scale: [0.5, 0.5, 0.5] }
        }
    },
    {
        id: 'ms_umbrella',
        label: 'display_sensei.preset.ms_umbrella',
        noteKey: 'display_sensei.preset_note.ms_umbrella',
        group: 'vanilla',
        confidence: 'vanilla',
        geometryVersion: null,
        areas: {
            thirdperson_righthand: { rotation: [70, 0, -15], translation: [1.5, 1.75, 7.25], scale: [0.9, 0.9, 0.9] },
            firstperson_righthand: { rotation: [0, 0, 0], translation: [1.5, 3, 1], scale: [0.9, 0.9, 0.9] },
            fixed: { rotation: [0, 0, 25], translation: [2.5, -3.5, 0], scale: [0.5, 0.5, 0.5] }
        }
    }
];

function findBedrockPreset(presetId) {
    return BEDROCK_PRESETS.find(preset => preset.id === presetId) || null;
}

// ---- src/project_data.js ----

const PROJECT_DATA_KEY = 'display_sensei';
const PROJECT_DATA_UNDO_ASPECT = 'display_sensei';
const PROJECT_DATA_VERSION = 1;

// =========================
// Data shape
// =========================
function createDefaultProjectData() {
    return normalizeProjectData({});
}

function normalizeProjectData(raw) {
    let data = isPlainObject(raw) ? raw : {};
    if (typeof data.v !== 'number') data.v = PROJECT_DATA_VERSION;
    if (!isPlainObject(data.inherit)) data.inherit = {};
    for (let slot of BEDROCK_SLOTS) {
        if (typeof data.inherit[slot.id] !== 'boolean') data.inherit[slot.id] = true;
    }
    data.unset_fields = normalizeUnsetFields(data.unset_fields);
    if (typeof data.gui_fit_to_frame !== 'boolean') data.gui_fit_to_frame = true;
    if (!isSupportedGeometryVersion(data.geometry_version)) data.geometry_version = DEFAULT_GEOMETRY_VERSION;
    if (!isPlainObject(data.entity_display_transforms)) data.entity_display_transforms = null;
    data.armor = normalizeArmorData(data.armor);
    data.holds = normalizeHoldData(data.holds);
    return data;
}

// =========================
// Held item data
// =========================
const PROJECT_HOLD_VIEWS = ['first_person', 'third_person'];
const PROJECT_HOLD_CHANNELS = ['position', 'rotation', 'scale'];

function isHoldVector(value) {
    return Array.isArray(value) && value.length === 3 && value.every(entry => typeof entry === 'number' && Number.isFinite(entry));
}

function normalizeHoldPose(raw) {
    if (!isPlainObject(raw)) return null;
    let pose = {};
    for (let channel of PROJECT_HOLD_CHANNELS) {
        if (!isHoldVector(raw[channel])) return null;
        pose[channel] = raw[channel].slice();
    }
    return pose;
}

function normalizeHoldStart(raw) {
    if (!isPlainObject(raw)) return null;
    let start = { pivot: isHoldVector(raw.pivot) ? raw.pivot.slice() : [0, 0, 0] };
    for (let view of PROJECT_HOLD_VIEWS) {
        start[view] = normalizeHoldPose(raw[view]);
        if (!start[view]) return null;
    }
    if (typeof raw.source === 'string') start.source = raw.source;
    return start;
}

function normalizeHoldLink(raw) {
    if (!isPlainObject(raw) || !isPlainObject(raw.cells)) return null;
    let cells = {};
    for (let key of Object.keys(raw.cells)) {
        let cell = raw.cells[key];
        if (!isPlainObject(cell) || typeof cell.animation !== 'string' || !Array.isArray(cell.plays)) continue;
        cells[key] = { animation: cell.animation, plays: cell.plays.filter(entry => typeof entry === 'string') };
    }
    return Object.keys(cells).length ? { cells } : null;
}

function normalizeHoldFiles(raw) {
    let files = {};
    if (!isPlainObject(raw)) return files;
    for (let key of Object.keys(raw)) {
        let file = raw[key];
        if (!isPlainObject(file) || typeof file.path !== 'string' || !file.path) continue;
        files[key] = {
            path: file.path,
            hash: typeof file.hash === 'string' ? file.hash : null,
            backup: typeof file.backup === 'string' ? file.backup : null,
            written: typeof file.written === 'string' ? file.written : null,
            confirmed: file.confirmed === true
        };
    }
    return files;
}

function normalizeHoldData(raw) {
    let holds = isPlainObject(raw) ? raw : {};
    let offHand = {};
    if (isPlainObject(holds.off_hand)) {
        for (let view of PROJECT_HOLD_VIEWS) {
            if (holds.off_hand[view] === 'own') offHand[view] = 'own';
        }
    }
    holds.off_hand = offHand;
    holds.start = normalizeHoldStart(holds.start);
    holds.link = normalizeHoldLink(holds.link);
    holds.files = normalizeHoldFiles(holds.files);
    if (typeof holds.target !== 'string' || !holds.target) holds.target = null;
    return holds;
}

// =========================
// Armor data
// =========================
const PROJECT_ARMOR_KINDS = ['auto', 'armor', 'worn', 'held'];
const ARMOR_FIT_IDENTITY = { position: [0, 0, 0], rotation: [0, 0, 0], scale: [1, 1, 1] };
const ARMOR_FIT_CHANNELS = Object.keys(ARMOR_FIT_IDENTITY);

function normalizeArmorData(raw) {
    let armor = isPlainObject(raw) ? raw : {};
    if (!PROJECT_ARMOR_KINDS.includes(armor.kind)) armor.kind = 'auto';
    if (typeof armor.slot !== 'string' || !findWearSlot(armor.slot)) armor.slot = null;
    armor.fit = normalizeFitOffsets(armor.fit);
    return armor;
}

function normalizeFitOffsets(raw) {
    let fit = {};
    if (!isPlainObject(raw)) return fit;
    for (let slotId of Object.keys(raw)) {
        if (!findWearSlot(slotId) || !isPlainObject(raw[slotId])) continue;
        let bones = {};
        for (let boneName of Object.keys(raw[slotId])) {
            let offset = normalizeFitOffset(raw[slotId][boneName]);
            if (boneName && offset) bones[boneName] = offset;
        }
        if (Object.keys(bones).length) fit[slotId] = bones;
    }
    return fit;
}

function isFitChannelValue(channel, values) {
    return Array.isArray(values) && values.length === 3 &&
        values.every(value => typeof value === 'number' && Number.isFinite(value) && (channel !== 'scale' || value > 0));
}

function normalizeFitOffset(raw) {
    if (!isPlainObject(raw)) return null;
    let offset = {};
    let changed = false;
    for (let channel of ARMOR_FIT_CHANNELS) {
        let identity = ARMOR_FIT_IDENTITY[channel];
        let values = isFitChannelValue(channel, raw[channel]) ? raw[channel].slice() : identity.slice();
        if (values.some((value, axis) => value !== identity[axis])) changed = true;
        offset[channel] = values;
    }
    return changed ? offset : null;
}

function normalizeUnsetFields(raw) {
    let fields = {};
    if (!isPlainObject(raw)) return fields;
    for (let slot of BEDROCK_SLOTS) {
        let list = Array.isArray(raw[slot.id]) ? FALLBACK_FIELDS.filter(field => raw[slot.id].includes(field)) : [];
        if (list.length) fields[slot.id] = list;
    }
    return fields;
}

function getProjectData(project = Project) {
    if (!project) return createDefaultProjectData();
    let data = normalizeProjectData(project[PROJECT_DATA_KEY]);
    project[PROJECT_DATA_KEY] = data;
    return data;
}

function updateProjectData(fn, project = Project) {
    let data = getProjectData(project);
    fn(data);
    return normalizeProjectData(data);
}

// =========================
// Saving in .bbmodel
// =========================
function createProjectDataProperty() {
    return new Property(ModelProject, 'object', PROJECT_DATA_KEY, {
        exposed: false,
        condition: { formats: BEDROCK_FORMAT_IDS }
    });
}

// =========================
// Undo
// =========================
function recordProjectDataInUndoSave(event) {
    let aspects = event.aspects || {};
    if (!aspects.display_slots && !aspects[PROJECT_DATA_UNDO_ASPECT]) return;
    if (getRoute() === 'none') return;
    event.save[PROJECT_DATA_KEY] = cloneJson(getProjectData());
}

function restoreProjectDataFromUndo(save) {
    let saved = save && save[PROJECT_DATA_KEY];
    if (!saved || getRoute() === 'none') return;
    let current = getProjectData();
    let restored = normalizeProjectData(cloneJson(saved));
    restored.holds.files = current.holds.files;
    restored.holds.link = current.holds.link;
    restored.holds.target = current.holds.target;
    Project[PROJECT_DATA_KEY] = restored;
}

// =========================
// Install
// =========================
function installProjectData() {
    return createDeletables([
        createProjectDataProperty,
        () => Blockbench.on('create_undo_save', guardListener('create_undo_save', recordProjectDataInUndoSave)),
        () => Blockbench.on('load_undo_save', guardListener('load_undo_save', event => restoreProjectDataFromUndo(event.save)))
    ]);
}

registerModuleInstaller('project_data', installProjectData);

// ---- src/pack_link.js ----

// =========================
// Pack link (read only)
// =========================

// =========================
// Wizards
// =========================
const WIZARDS = [
    { id: 'item', stampKey: 'blockbench_item_wizard', dialogId: 'minecraft_item_wizard', trackerGlobal: 'ItemWizardProject', modelKind: 'attachable' },
    { id: 'block', stampKey: 'blockbench_block_wizard', dialogId: 'minecraft_block_wizard', trackerGlobal: 'BlockWizardProject', modelKind: 'block' },
    { id: 'entity', stampKey: 'blockbench_entity_wizard', dialogId: 'minecraft_entity_wizard', trackerGlobal: 'EntityWizardProject', modelKind: 'entity' }
];

const WIZARD_FILES = {
    item: [
        { pack: 'bp', path: 'items/{f}.item.json' },
        { pack: 'bp', path: 'manifest.json' },
        { pack: 'bp', path: 'pack_icon.png' },
        { pack: 'rp', path: 'attachables/{f}.attachable.json' },
        { pack: 'rp', path: 'animations/attachables/{f}.animation.json' },
        { pack: 'rp', path: 'textures/item_texture.json' },
        { pack: 'rp', path: 'texts/en_US.lang' },
        { pack: 'rp', path: 'manifest.json' },
        { pack: 'rp', path: 'pack_icon.png' }
    ],
    block: [
        { pack: 'bp', path: 'blocks/{f}.block.json' },
        { pack: 'bp', path: 'loot_tables/blocks/{f}.json' },
        { pack: 'bp', path: 'manifest.json' },
        { pack: 'bp', path: 'pack_icon.png' },
        { pack: 'rp', path: 'models/blocks/{f}.geo.json' },
        { pack: 'rp', path: 'block_culling/leaves.block_culling_rules.json' },
        { pack: 'rp', path: 'textures/blocks/{f}.png' },
        { pack: 'rp', path: 'textures/terrain_texture.json' },
        { pack: 'rp', path: 'textures/flipbook_textures.json' },
        { pack: 'rp', path: 'blocks.json' },
        { pack: 'rp', path: 'texts/en_US.lang' },
        { pack: 'rp', path: 'manifest.json' },
        { pack: 'rp', path: 'pack_icon.png' }
    ],
    entity: [
        { pack: 'bp', path: 'entities/{f}.behavior.json' },
        { pack: 'bp', path: 'loot_tables/entities/{f}.json' },
        { pack: 'bp', path: 'manifest.json' },
        { pack: 'bp', path: 'pack_icon.png' },
        { pack: 'rp', path: 'models/entity/{f}.geo.json' },
        { pack: 'rp', path: 'textures/entity/{f}.png' },
        { pack: 'rp', path: 'textures/entity/{f}/' },
        { pack: 'rp', path: 'animations/{f}.animation.json' },
        { pack: 'rp', path: 'render_controllers/{f}.render_controllers.json' },
        { pack: 'rp', path: 'entity/{f}.entity.json' },
        { pack: 'rp', path: 'textures/item_texture.json' },
        { pack: 'rp', path: 'textures/items/{f}_spawn_egg.png' },
        { pack: 'rp', path: 'texts/en_US.lang' },
        { pack: 'rp', path: 'sounds.json' },
        { pack: 'rp', path: 'manifest.json' },
        { pack: 'rp', path: 'pack_icon.png' }
    ]
};

const ITEM_WIZARD_PRESET_MODELS = [
    { preset: 'iron_ingot', fingerprint: '9cdfe544' },
    { preset: 'apple', fingerprint: 'fcc7ccfd' },
    { preset: 'sword', fingerprint: '6d1c1630' },
    { preset: 'pickaxe', fingerprint: '68b601e6' },
    { preset: 'helmet', fingerprint: '8c3c9e37' },
    { preset: 'chestplate', fingerprint: '54072157' },
    { preset: 'leggings', fingerprint: 'e7f78b52' },
    { preset: 'boots', fingerprint: '511756e0' }
];

function findWizard(wizardId) {
    return WIZARDS.find(wizard => wizard.id === wizardId) || null;
}

function isProjectTrackedByWizard(wizardId, project = Project) {
    let wizard = findWizard(wizardId);
    let tracker = wizard ? window[wizard.trackerGlobal] : null;
    return !!project && isPlainObject(tracker) && !!tracker.project && tracker.project === project.uuid;
}

function isDialogOpen(dialogId) {
    if (typeof Dialog === 'undefined') return false;
    if (Dialog.open && Dialog.open.id === dialogId) return true;
    return Array.isArray(Dialog.stack) && Dialog.stack.some(dialog => !!dialog && dialog.id === dialogId);
}

function isWizardDialogOpen(wizardId) {
    let wizard = findWizard(wizardId);
    return !!wizard && isDialogOpen(wizard.dialogId);
}

// =========================
// Wizard compiles
// =========================
let overwriteDepth = 0;

function runInsideBedrockOverwrite(fn) {
    overwriteDepth++;
    try {
        return fn();
    } finally {
        overwriteDepth--;
    }
}

function isInsideBedrockOverwrite() {
    return overwriteDepth > 0;
}

function isPluginRawCompile(event) {
    return !!event && !!event.options && event.options.raw === true && !isInsideBedrockOverwrite();
}

function getWizardEntityCompileSource(event) {
    if (!Project) return null;
    if (Project.geometry_name === '{name}') return 'entity';
    if (!isPluginRawCompile(event)) return null;
    if (isWizardDialogOpen('item') || isProjectTrackedByWizard('item', Project)) return 'item';
    if (isWizardDialogOpen('entity') || isProjectTrackedByWizard('entity', Project)) return 'entity';
    return null;
}

function isBlockWizardCompile(event) {
    return isPluginRawCompile(event) && (isWizardDialogOpen('block') || isProjectTrackedByWizard('block', Project));
}

function stripItemDisplayTransforms(geometries) {
    for (let geometry of geometries) {
        if (isPlainObject(geometry)) delete geometry.item_display_transforms;
    }
}

let itemWizardNoticeProjects = new WeakSet();
let blockWizardNoticeProjects = new WeakSet();

function noteItemWizardCompile() {
    if (!Project || itemWizardNoticeProjects.has(Project)) return;
    itemWizardNoticeProjects.add(Project);
    showNotification('item_wizard_compile', i18n('display_sensei.message.item_wizard_compile'));
}

function getBlockWizardVersionLosses(transforms) {
    if (!isPlainObject(transforms)) return [];
    let losses = [];
    if (transforms.shelf) losses.push('shelf');
    if (isPlainObject(transforms.gui) && transforms.gui.fit_to_frame === false) losses.push('fit_to_frame_off');
    return losses;
}

function describeBlockWizardVersionLosses(losses) {
    let sentences = [];
    if (losses.includes('shelf')) sentences.push(i18n('display_sensei.wizard_feature.shelf'));
    if (losses.includes('fit_to_frame_off')) sentences.push(i18n('display_sensei.wizard_feature.fit_to_frame_off'));
    return sentences.join(' ');
}

function noteBlockWizardCompile(transforms) {
    let losses = getBlockWizardVersionLosses(transforms);
    if (!losses.length || blockWizardNoticeProjects.has(Project)) return;
    blockWizardNoticeProjects.add(Project);
    showNotification('block_wizard_version', i18nFormat('display_sensei.message.block_wizard_version', {
        features: describeBlockWizardVersionLosses(losses)
    }));
}

// =========================
// Ctrl+S into models/entity
// =========================
const ENTITY_MODELS_FOLDER = /[\\/]models[\\/]entity[\\/]/i;

const UNSAVED_WORK_DIALOG_ID = 'close';

let bypassSaveGuard = false;
let dismissedSaveWarnings = new WeakSet();

function needsEntitySaveWarning(project = Project) {
    return !!project && !!project.format && project.format.id === BLOCK_FORMAT_ID &&
        typeof project.export_path === 'string' && ENTITY_MODELS_FOLDER.test(project.export_path) &&
        !dismissedSaveWarnings.has(project);
}

function onExportOverUse() {
    if (bypassSaveGuard || isDialogOpen(UNSAVED_WORK_DIALOG_ID) || !needsEntitySaveWarning()) return undefined;
    showEntitySaveWarning(Project);
    return false;
}

function getWrittenGeometryId(project) {
    return 'geometry.' + (project.geometry_name || 'unknown');
}

function identifierMatchesFileName(project) {
    let name = String(project.geometry_name || '').toLowerCase();
    return !!name && getGeometryFileStem(String(project.export_path)).toLowerCase() === name;
}

function showEntitySaveWarning(project) {
    let path = String(project.export_path).replace(/`/g, '');
    let identifier = getWrittenGeometryId(project).replace(/`/g, '');
    let message = i18nFormat('display_sensei.save_guard.message', { path, identifier });
    if (identifierMatchesFileName(project)) {
        message += '\n\n' + i18nFormat('display_sensei.save_guard.renamed', { identifier });
    }
    Blockbench.showMessageBox({
        title: i18n('display_sensei.save_guard.title'),
        message,
        icon: 'warning',
        buttons: [
            i18n('display_sensei.save_guard.save_anyway'),
            i18n('display_sensei.save_guard.save_elsewhere'),
            i18n('display_sensei.ui.cancel')
        ],
        confirmIndex: 0,
        cancelIndex: 2,
        checkboxes: {
            dont_ask: { value: false, text: i18n('display_sensei.save_guard.dont_ask') }
        }
    }, (button, result) => {
        try {
            onEntitySaveWarningClosed(project, button, result);
        } catch (error) {
            console.warn(LOG_PREFIX, 'The save warning failed:', error);
        }
    });
}

function onEntitySaveWarningClosed(project, button, result) {
    if (project !== Project) return;
    if (button === 0) {
        if (result && result.dont_ask === true) dismissedSaveWarnings.add(project);
        bypassSaveGuard = true;
        try {
            BarItems.export_over.click();
        } finally {
            bypassSaveGuard = false;
        }
    } else if (button === 1) {
        saveSomewhereElse(project).catch(error => console.warn(LOG_PREFIX, 'Saving somewhere else failed:', error));
    }
}

async function saveSomewhereElse(project) {
    await saveTextures();
    if (project !== Project) return;
    if (project.save_path) {
        Codecs.project.write(Codecs.project.compile(), project.save_path);
    }
    await Codecs.bedrock.export();
}

function createSaveGuardListener() {
    let action = typeof BarItems !== 'undefined' ? BarItems.export_over : null;
    if (!action || typeof action.on !== 'function') return { delete() {} };
    return action.on('use', guardVetoListener('save guard', onExportOverUse));
}

// =========================
// Geometry fingerprints
// =========================
function canonicalJson(value) {
    if (Array.isArray(value)) return '[' + value.map(canonicalJson).join(',') + ']';
    if (isPlainObject(value)) {
        let keys = Object.keys(value).sort();
        return '{' + keys.map(key => JSON.stringify(key) + ':' + canonicalJson(value[key])).join(',') + '}';
    }
    if (typeof value === 'number') return JSON.stringify(Math.round(value * 10000) / 10000);
    return JSON.stringify(value);
}

function fnv1aHex(text) {
    let hash = 0x811c9dc5;
    for (let index = 0; index < text.length; index++) {
        hash ^= text.charCodeAt(index);
        hash = Math.imul(hash, 0x01000193) >>> 0;
    }
    return hash.toString(16).padStart(8, '0');
}

function getGeometryFingerprint(geometry) {
    if (!isPlainObject(geometry)) return null;
    let copy = Object.assign({}, geometry);
    if (isPlainObject(copy.description)) {
        copy.description = Object.assign({}, copy.description);
        delete copy.description.identifier;
    }
    return fnv1aHex(canonicalJson(copy));
}

function findItemWizardPreset(geometry) {
    let fingerprint = getGeometryFingerprint(geometry);
    let match = ITEM_WIZARD_PRESET_MODELS.find(entry => entry.fingerprint === fingerprint);
    return match ? match.preset : null;
}

// =========================
// Reading files
// =========================
function isDesktopApp() {
    return typeof isApp !== 'undefined' && !!isApp && typeof PathModule !== 'undefined';
}

function escapeRegExp(text) {
    return String(text).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function exactNameRegex(name) {
    return new RegExp('^' + escapeRegExp(name) + '$', 'i');
}

function containingRegex(text) {
    return text ? new RegExp(escapeRegExp(text), 'i') : undefined;
}

function findFiles(folders, options, check) {
    return Blockbench.findFileFromContent(folders, options, (path, content) => {
        try {
            return check(path, content);
        } catch (error) {
            return false;
        }
    });
}

function readJsonInFolder(folder, fileName) {
    let found = findFiles([folder], { filter_regex: exactNameRegex(fileName), recursive: false, json: true },
        (path, content) => (isPlainObject(content) ? { path, content } : false));
    return found || null;
}

function listFolder(folder) {
    let names = [];
    findFiles([folder], { recursive: false, read_file: false }, path => {
        names.push(PathModule.basename(path));
        return false;
    });
    return names;
}

function fileExists(scan, absolutePath) {
    let folder = PathModule.dirname(absolutePath);
    let key = folder.toLowerCase();
    if (!scan.listings.has(key)) {
        scan.listings.set(key, listFolder(folder).map(name => name.toLowerCase()));
    }
    return scan.listings.get(key).includes(PathModule.basename(absolutePath).toLowerCase());
}

function findJsonInFolderTree(folder, hint, test) {
    let found = findFiles([folder], { filter_regex: /\.json$/i, priority_regex: containingRegex(hint), json: true },
        (path, content) => (isPlainObject(content) && test(content) ? { path, content } : false));
    return found || null;
}

function findFilesDefining(folder, ids, hint, sectionKey) {
    let found = {};
    let remaining = ids.slice();
    if (!remaining.length) return found;
    findFiles([folder], { filter_regex: /\.json$/i, priority_regex: containingRegex(hint), json: true }, (path, content) => {
        let section = isPlainObject(content) ? content[sectionKey] : null;
        if (!isPlainObject(section)) return false;
        let stillMissing = [];
        for (let id of remaining) {
            if (Object.prototype.hasOwnProperty.call(section, id)) {
                found[id] = path;
            } else {
                stillMissing.push(id);
            }
        }
        remaining = stillMissing;
        return remaining.length === 0;
    });
    return found;
}

// =========================
// Searches remembered for the session
// =========================
let behaviorPackManifests = new Map();
let missingIds = new Map();

function forgetRememberedSearches() {
    behaviorPackManifests = new Map();
    missingIds = new Map();
}

function readBehaviorPackManifests(packsFolder) {
    let key = packsFolder.toLowerCase();
    if (!behaviorPackManifests.has(key)) {
        let manifests = [];
        findFiles([packsFolder], { filter_regex: /^manifest\.json$/i, json: true }, (path, content) => {
            if (isPlainObject(content)) manifests.push({ path: PathModule.dirname(path), manifest: content });
            return false;
        });
        behaviorPackManifests.set(key, manifests);
    }
    return behaviorPackManifests.get(key);
}

function findPackFilesDefining(scan, folderName, ids, sectionKey) {
    let rootKey = scan.roots.rp.toLowerCase();
    if (!missingIds.has(rootKey)) missingIds.set(rootKey, new Set());
    let missing = missingIds.get(rootKey);
    let wanted = [];
    for (let id of ids) {
        if (!missing.has(sectionKey + '|' + id)) wanted.push(id);
    }
    let found = findFilesDefining(PathModule.join(scan.roots.rp, folderName), wanted, scan.stem, sectionKey);
    for (let id of wanted) {
        if (!found[id]) missing.add(sectionKey + '|' + id);
    }
    return found;
}

function joinPackPath(root, relativePath) {
    return PathModule.join(root, ...relativePath.split('/'));
}

function relativePackPath(root, absolutePath) {
    return PathModule.relative(root, absolutePath).split(PathModule.sep).join('/');
}

function isInsideFolder(folder, path) {
    let relative = PathModule.relative(folder, path);
    return !!relative && !relative.startsWith('..') && !PathModule.isAbsolute(relative);
}

function getGeometryFileStem(path) {
    return getFileBaseName(path).replace(/\.json$/i, '').replace(/\.geo$/i, '');
}

// =========================
// Packs
// =========================
const MAX_PACK_ROOT_DEPTH = 8;

function hasModuleType(manifest, type) {
    return isPlainObject(manifest) && Array.isArray(manifest.modules) &&
        manifest.modules.some(module => isPlainObject(module) && module.type === type);
}

function getManifestUuid(manifest) {
    let header = isPlainObject(manifest) ? manifest.header : null;
    return isPlainObject(header) && typeof header.uuid === 'string' ? header.uuid.toLowerCase() : null;
}

function getDependencyUuids(manifest) {
    if (!isPlainObject(manifest) || !Array.isArray(manifest.dependencies)) return [];
    return manifest.dependencies
        .filter(dependency => isPlainObject(dependency) && typeof dependency.uuid === 'string')
        .map(dependency => dependency.uuid.toLowerCase());
}

function findResourcePackRoot(startPath) {
    let folder = PathModule.dirname(startPath);
    for (let depth = 0; depth < MAX_PACK_ROOT_DEPTH; depth++) {
        let manifest = readJsonInFolder(folder, 'manifest.json');
        if (manifest && hasModuleType(manifest.content, 'resources')) return { path: folder, manifest: manifest.content };
        if (manifest && hasModuleType(manifest.content, 'data')) return null;
        if (/(resource_packs|behavior_packs)$/i.test(PathModule.basename(folder))) return null;
        let parent = PathModule.dirname(folder);
        if (parent === folder) return null;
        folder = parent;
    }
    return null;
}

function readWizardStamps(manifest) {
    let metadata = isPlainObject(manifest) ? manifest.metadata : null;
    let generatedWith = isPlainObject(metadata) ? metadata.generated_with : null;
    if (!isPlainObject(generatedWith)) return [];
    return Object.keys(generatedWith).map(key => {
        let wizard = WIZARDS.find(entry => entry.stampKey === key);
        let raw = generatedWith[key];
        let versions = (Array.isArray(raw) ? raw : [raw]).filter(version => typeof version === 'string');
        return { wizard: wizard ? wizard.id : 'other', key, versions };
    });
}

function mergeStamps(first, second) {
    let stamps = cloneJson(first);
    for (let stamp of second) {
        let same = stamps.find(entry => entry.key === stamp.key);
        if (!same) {
            stamps.push(cloneJson(stamp));
            continue;
        }
        for (let version of stamp.versions) {
            if (!same.versions.includes(version)) same.versions.push(version);
        }
    }
    return stamps;
}

function getBehaviorPacksFolder(resourcePacksFolder) {
    let name = PathModule.basename(resourcePacksFolder);
    if (!/resource_packs$/i.test(name)) return resourcePacksFolder;
    let pairedName = name.slice(0, name.length - 'resource_packs'.length) + 'behavior_packs';
    return PathModule.join(PathModule.dirname(resourcePacksFolder), pairedName);
}

const BEHAVIOR_PACK_NAME_SWAPS = [
    ['RP', 'BP'], ['rp', 'bp'], ['Rp', 'Bp'],
    ['Resources', 'Behavior'], ['Resources', 'Behaviors'], ['Resource', 'Behavior'],
    ['resources', 'behavior'], ['resources', 'behaviors'], ['resource', 'behavior']
];

const BEHAVIOR_PACK_SUFFIX_SWAPS = [['RP', 'BP'], ['rp', 'bp'], ['Rp', 'Bp']];

function guessBehaviorPackNames(resourcePackName) {
    let names = [resourcePackName];
    for (let [from, to] of BEHAVIOR_PACK_NAME_SWAPS) {
        let word = new RegExp('(^|[^A-Za-z])' + from + '(?=[^A-Za-z]|$)', 'g');
        let swapped = resourcePackName.replace(word, '$1' + to);
        if (!names.includes(swapped)) names.push(swapped);
    }
    for (let [from, to] of BEHAVIOR_PACK_SUFFIX_SWAPS) {
        if (!resourcePackName.endsWith(from)) continue;
        let swapped = resourcePackName.slice(0, resourcePackName.length - from.length) + to;
        if (!names.includes(swapped)) names.push(swapped);
    }
    return names;
}

function pairsWithResourcePack(bpManifest, rpUuid, rpDependencyUuids) {
    if (!hasModuleType(bpManifest, 'data')) return false;
    let bpUuid = getManifestUuid(bpManifest);
    return (!!rpUuid && getDependencyUuids(bpManifest).includes(rpUuid)) ||
        (!!bpUuid && rpDependencyUuids.includes(bpUuid));
}

function pairsByNameAlone(bpManifest, rpDependencyUuids) {
    return hasModuleType(bpManifest, 'data') && rpDependencyUuids.length === 0 && getDependencyUuids(bpManifest).length === 0;
}

function foundBehaviorPack(path, manifest) {
    return { path, name: PathModule.basename(path), manifest, status: 'found', candidates: [] };
}

function noBehaviorPack(status, candidates) {
    return { path: null, name: null, manifest: null, status, candidates };
}

function findBehaviorPack(rpRoot, rpManifest) {
    let rpName = PathModule.basename(rpRoot);
    let packsFolder = getBehaviorPacksFolder(PathModule.dirname(rpRoot));
    let rpUuid = getManifestUuid(rpManifest);
    let rpDependencyUuids = getDependencyUuids(rpManifest);

    for (let name of guessBehaviorPackNames(rpName)) {
        let folder = PathModule.join(packsFolder, name);
        if (folder.toLowerCase() === rpRoot.toLowerCase()) continue;
        let manifest = readJsonInFolder(folder, 'manifest.json');
        if (!manifest) continue;
        if (pairsWithResourcePack(manifest.content, rpUuid, rpDependencyUuids) || pairsByNameAlone(manifest.content, rpDependencyUuids)) {
            return foundBehaviorPack(folder, manifest.content);
        }
    }
    if (!/behavior_packs$/i.test(PathModule.basename(packsFolder))) return noBehaviorPack('missing', []);
    let matches = [];
    for (let entry of readBehaviorPackManifests(packsFolder)) {
        if (pairsWithResourcePack(entry.manifest, rpUuid, rpDependencyUuids)) matches.push(entry);
    }
    if (matches.length === 1) return foundBehaviorPack(matches[0].path, matches[0].manifest);
    if (matches.length > 1) {
        let names = [];
        for (let match of matches) names.push(PathModule.basename(match.path));
        return noBehaviorPack('ambiguous', names);
    }
    return noBehaviorPack('missing', []);
}

// =========================
// The model in the pack
// =========================
function getStartPath(project) {
    let candidates = [project.export_path, project.save_path];
    for (let texture of project.textures || []) candidates.push(texture && texture.path);
    return candidates.find(path => typeof path === 'string' && path !== '' && PathModule.isAbsolute(path)) || null;
}

function getGeometries(content) {
    let list = isPlainObject(content) ? content['minecraft:geometry'] : null;
    return Array.isArray(list) ? list.filter(isPlainObject) : [];
}

function findGeometryById(content, identifier) {
    return getGeometries(content).find(geometry =>
        isPlainObject(geometry.description) && geometry.description.identifier === identifier) || null;
}

function findGeometryFile(scan) {
    let project = scan.project;
    let identifier = project.geometry_name ? 'geometry.' + project.geometry_name : null;
    let exportPath = project.export_path;
    if (exportPath && isInsideFolder(scan.roots.rp, exportPath)) {
        let file = readJsonInFolder(PathModule.dirname(exportPath), PathModule.basename(exportPath));
        if (!file) return null;
        let geometry = (identifier && findGeometryById(file.content, identifier)) || getGeometries(file.content)[0] || null;
        return { path: file.path, geometry };
    }
    if (!identifier) return null;
    let found = findJsonInFolderTree(PathModule.join(scan.roots.rp, 'models'), project.geometry_name,
        content => !!findGeometryById(content, identifier));
    return found ? { path: found.path, geometry: findGeometryById(found.content, identifier) } : null;
}

function kindFromFolder(relativeGeometryPath) {
    let path = relativeGeometryPath.toLowerCase();
    if (path.startsWith('models/entity/attachable/') || path.startsWith('models/entity/attachables/')) return 'attachable';
    return null;
}

const ENTITY_FILE_TYPES = [
    { kind: 'attachable', folder: 'attachables', key: 'minecraft:attachable' },
    { kind: 'entity', folder: 'entity', key: 'minecraft:client_entity' }
];

function getDefinitionDescription(content, key) {
    let main = isPlainObject(content) ? content[key] : null;
    return isPlainObject(main) && isPlainObject(main.description) ? main.description : null;
}

function getStringValues(object) {
    return isPlainObject(object) ? Object.values(object).filter(value => typeof value === 'string') : [];
}

function classifyEntityFile(rpRoot, geometryName, preferredKind = null) {
    if (!geometryName) return null;
    let wanted = 'geometry.' + geometryName;
    let types = preferredKind === 'entity' ? ENTITY_FILE_TYPES.slice().reverse() : ENTITY_FILE_TYPES;
    for (let type of types) {
        let found = findJsonInFolderTree(PathModule.join(rpRoot, type.folder), geometryName, content => {
            let description = getDefinitionDescription(content, type.key);
            return !!description && getStringValues(description.geometry).includes(wanted);
        });
        if (found) return { kind: type.kind, path: found.path, description: getDefinitionDescription(found.content, type.key) };
    }
    return null;
}

function getAttachableItemIds(attachableDescription) {
    let ids = [];
    if (!attachableDescription) return ids;
    if (isPlainObject(attachableDescription.item)) {
        for (let id of Object.keys(attachableDescription.item)) ids.push(id);
    }
    let identifier = attachableDescription.identifier;
    if (typeof identifier === 'string' && !ids.includes(identifier)) ids.push(identifier);
    return ids;
}

function findLinkedItem(bpRoot, attachableDescription, stem) {
    let ids = getAttachableItemIds(attachableDescription);
    if (!bpRoot || !ids.length) return null;
    return findJsonInFolderTree(PathModule.join(bpRoot, 'items'), stem, content => {
        let description = getDefinitionDescription(content, 'minecraft:item');
        return !!description && ids.includes(description.identifier);
    });
}

function findLinkedEntity(bpRoot, clientDescription, stem) {
    let identifier = clientDescription && clientDescription.identifier;
    if (!bpRoot || typeof identifier !== 'string') return null;
    return findJsonInFolderTree(PathModule.join(bpRoot, 'entities'), stem, content => {
        let description = getDefinitionDescription(content, 'minecraft:entity');
        return !!description && description.identifier === identifier;
    });
}

function getBlockComponentLists(content) {
    let block = isPlainObject(content) ? content['minecraft:block'] : null;
    if (!isPlainObject(block)) return [];
    let lists = [block.components];
    if (Array.isArray(block.permutations)) {
        for (let permutation of block.permutations) lists.push(isPlainObject(permutation) ? permutation.components : null);
    }
    return lists.filter(isPlainObject);
}

function blockUsesGeometry(content, geometryId) {
    return getBlockComponentLists(content).some(components => {
        let geometry = components['minecraft:geometry'];
        return geometry === geometryId || (isPlainObject(geometry) && geometry.identifier === geometryId);
    });
}

function findLinkedBlock(bpRoot, geometryId, stem) {
    if (!bpRoot) return null;
    return findJsonInFolderTree(PathModule.join(bpRoot, 'blocks'), stem, content => blockUsesGeometry(content, geometryId));
}

function getMaterialTextureNames(content) {
    let names = [];
    for (let components of getBlockComponentLists(content)) {
        let instances = components['minecraft:material_instances'];
        if (!isPlainObject(instances)) continue;
        for (let instance of Object.values(instances)) {
            if (isPlainObject(instance) && typeof instance.texture === 'string' && !names.includes(instance.texture)) {
                names.push(instance.texture);
            }
        }
    }
    return names;
}

function getItemComponents(content) {
    let item = isPlainObject(content) ? content['minecraft:item'] : null;
    return isPlainObject(item) && isPlainObject(item.components) ? item.components : null;
}

function readComponentValue(component) {
    return isPlainObject(component) && 'value' in component ? component.value : component;
}

function getItemIconName(components) {
    let icon = components['minecraft:icon'];
    if (typeof icon === 'string') return icon;
    if (!isPlainObject(icon)) return null;
    if (typeof icon.texture === 'string') return icon.texture;
    if (isPlainObject(icon.textures) && typeof icon.textures.default === 'string') return icon.textures.default;
    return null;
}

function readAtlasTexturePaths(entry) {
    let textures = isPlainObject(entry) ? entry.textures : null;
    let paths = [];
    for (let texture of Array.isArray(textures) ? textures : [textures]) {
        if (typeof texture === 'string') {
            paths.push(texture);
        } else if (isPlainObject(texture) && typeof texture.path === 'string') {
            paths.push(texture.path);
        } else if (isPlainObject(texture) && Array.isArray(texture.variations)) {
            for (let variation of texture.variations) {
                if (isPlainObject(variation) && typeof variation.path === 'string') paths.push(variation.path);
            }
        }
    }
    return paths;
}

function getRenderControllerIds(list) {
    if (!Array.isArray(list)) return [];
    let ids = [];
    for (let entry of list) {
        if (typeof entry === 'string') ids.push(entry);
        else if (isPlainObject(entry)) ids.push(...Object.keys(entry));
    }
    return ids;
}

// =========================
// File list
// =========================
const ROLE_KINDS = {
    geometry: 'look',
    attachable: 'look',
    client_entity: 'look',
    animation: 'look',
    render_controller: 'look',
    texture: 'look',
    item_texture: 'look',
    icon: 'look',
    spawn_egg: 'look',
    terrain_texture: 'look',
    flipbook: 'look',
    item: 'code',
    entity: 'code',
    block: 'code',
    lang: 'code',
    sounds: 'code',
    blocks_json: 'code',
    manifest: 'code',
    pack_icon: 'code'
};

function addFileRow(scan, pack, path, role, exists, id = null, maybeGame = false) {
    let key = [pack, path.toLowerCase(), exists === true ? '' : id].join('|');
    if (scan.rowKeys.has(key)) return;
    scan.rowKeys.add(key);
    scan.files.push({
        pack, path, role, kind: ROLE_KINDS[role] || 'code', rewritten: false, exists, maybe_game: maybeGame, id
    });
}

function isKnownGameReference(reference) {
    let text = reference.toLowerCase();
    return text.startsWith('minecraft:') || text.startsWith('textures/misc/') || text.startsWith('controller.render.');
}

function addReferenceNotInPack(scan, reference, role, id) {
    if (isKnownGameReference(reference)) {
        addFileRow(scan, 'game', reference, role, null, id);
    } else {
        addFileRow(scan, 'rp', reference, role, false, id, true);
    }
}

function addFoundFile(scan, pack, absolutePath, role, id = null) {
    addFileRow(scan, pack, relativePackPath(scan.roots[pack], absolutePath), role, true, id);
}

function addFileIfPresent(scan, pack, relativePath, role) {
    let root = scan.roots[pack];
    if (root && fileExists(scan, joinPackPath(root, relativePath))) addFileRow(scan, pack, relativePath, role, true);
}

function addLinkedFile(scan, pack, found, role, searchedFolder, id) {
    if (found) {
        addFoundFile(scan, pack, found.path, role, id);
    } else if (id && isKnownGameReference(id)) {
        addFileRow(scan, 'game', id, role, null, id);
    } else if (id) {
        addFileRow(scan, pack, searchedFolder, role, scan.roots[pack] ? false : null, id);
    }
}

function addTextureRow(scan, texturePath, role, id = texturePath) {
    let clean = texturePath.replace(/\\/g, '/').replace(/^\/+/, '');
    let candidates = /\.(png|tga)$/i.test(clean) ? [clean] : [clean + '.png', clean + '.tga'];
    let found = candidates.find(path => fileExists(scan, joinPackPath(scan.roots.rp, path)));
    if (found) {
        addFileRow(scan, 'rp', found, role, true, id);
    } else {
        addReferenceNotInPack(scan, clean, role, id);
    }
}

function addIconRows(scan, shortName, role) {
    if (!shortName) return;
    let atlas = readJsonInFolder(PathModule.join(scan.roots.rp, 'textures'), 'item_texture.json');
    if (atlas) addFoundFile(scan, 'rp', atlas.path, 'item_texture');
    let data = atlas && isPlainObject(atlas.content.texture_data) ? atlas.content.texture_data : {};
    let paths = readAtlasTexturePaths(data[shortName]);
    if (!paths.length) addReferenceNotInPack(scan, shortName, role, shortName);
    for (let path of paths) addTextureRow(scan, path, role, shortName);
}

function addAnimationRows(scan, ids) {
    let controllerIds = ids.filter(id => id.startsWith('controller.'));
    let animationIds = ids.filter(id => !id.startsWith('controller.'));
    let groups = [
        { folder: 'animations', section: 'animations', ids: animationIds },
        { folder: 'animation_controllers', section: 'animation_controllers', ids: controllerIds }
    ];
    for (let group of groups) {
        let found = findPackFilesDefining(scan, group.folder, group.ids, group.section);
        for (let id of group.ids) {
            if (found[id]) scan.animationFiles[id] = found[id];
            if (found[id]) addFoundFile(scan, 'rp', found[id], 'animation', id);
            else addReferenceNotInPack(scan, id, 'animation', id);
        }
    }
}

function addRenderControllerRows(scan, ids) {
    let found = findPackFilesDefining(scan, 'render_controllers', ids, 'render_controllers');
    for (let id of ids) {
        if (found[id]) addFoundFile(scan, 'rp', found[id], 'render_controller', id);
        else addReferenceNotInPack(scan, id, 'render_controller', id);
    }
}

function addGeometryRow(scan) {
    let id = scan.project.geometry_name ? 'geometry.' + scan.project.geometry_name : null;
    addLinkedFile(scan, 'rp', scan.geometryFile, 'geometry', 'models/', id);
}

function addEntityFileRow(scan, role, folder) {
    let id = scan.project.geometry_name ? 'geometry.' + scan.project.geometry_name : null;
    addLinkedFile(scan, 'rp', scan.entityFile, role, folder, id);
}

function listAttachableFiles(scan) {
    addGeometryRow(scan);
    addEntityFileRow(scan, 'attachable', 'attachables/');
    let description = scan.entityFile ? scan.entityFile.description : null;
    if (!description) return;
    addAnimationRows(scan, getStringValues(description.animations));
    for (let texture of getStringValues(description.textures)) addTextureRow(scan, texture, 'texture');
    scan.item = findLinkedItem(scan.roots.bp, description, scan.stem);
    let components = scan.item ? getItemComponents(scan.item.content) : null;
    if (components) addIconRows(scan, getItemIconName(components), 'icon');
    let itemDescription = scan.item ? getDefinitionDescription(scan.item.content, 'minecraft:item') : null;
    let itemId = itemDescription ? itemDescription.identifier : (getAttachableItemIds(description)[0] || null);
    addLinkedFile(scan, 'bp', scan.item, 'item', 'items/', itemId);
}

function listEntityFiles(scan) {
    addGeometryRow(scan);
    addEntityFileRow(scan, 'client_entity', 'entity/');
    let description = scan.entityFile ? scan.entityFile.description : null;
    if (description) {
        addAnimationRows(scan, getStringValues(description.animations));
        addRenderControllerRows(scan, getRenderControllerIds(description.render_controllers));
        for (let texture of getStringValues(description.textures)) addTextureRow(scan, texture, 'texture');
        let spawnEgg = description.spawn_egg;
        if (isPlainObject(spawnEgg) && typeof spawnEgg.texture === 'string') addIconRows(scan, spawnEgg.texture, 'spawn_egg');
        let entity = findLinkedEntity(scan.roots.bp, description, scan.stem);
        addLinkedFile(scan, 'bp', entity, 'entity', 'entities/', typeof description.identifier === 'string' ? description.identifier : null);
    }
    addFileIfPresent(scan, 'rp', 'sounds.json', 'sounds');
}

function listBlockFiles(scan) {
    addGeometryRow(scan);
    let geometryId = scan.project.geometry_name ? 'geometry.' + scan.project.geometry_name : null;
    let block = geometryId ? findLinkedBlock(scan.roots.bp, geometryId, scan.stem) : null;
    let atlas = readJsonInFolder(PathModule.join(scan.roots.rp, 'textures'), 'terrain_texture.json');
    if (atlas) addFoundFile(scan, 'rp', atlas.path, 'terrain_texture');
    let data = atlas && isPlainObject(atlas.content.texture_data) ? atlas.content.texture_data : {};
    for (let name of block ? getMaterialTextureNames(block.content) : []) {
        let paths = readAtlasTexturePaths(data[name]);
        if (!paths.length) addReferenceNotInPack(scan, name, 'texture', name);
        for (let path of paths) addTextureRow(scan, path, 'texture', name);
    }
    addFileIfPresent(scan, 'rp', 'textures/flipbook_textures.json', 'flipbook');
    addLinkedFile(scan, 'bp', block, 'block', 'blocks/', geometryId);
    addFileIfPresent(scan, 'rp', 'blocks.json', 'blocks_json');
}

function addPackFiles(scan) {
    addFileIfPresent(scan, 'rp', 'texts/en_US.lang', 'lang');
    addFileIfPresent(scan, 'bp', 'texts/en_US.lang', 'lang');
    addFileRow(scan, 'rp', 'manifest.json', 'manifest', true);
    addFileIfPresent(scan, 'rp', 'pack_icon.png', 'pack_icon');
    if (scan.roots.bp) {
        addFileRow(scan, 'bp', 'manifest.json', 'manifest', true);
        addFileIfPresent(scan, 'bp', 'pack_icon.png', 'pack_icon');
    }
}

function markRewrittenFiles(files, wizardId, stem) {
    let rewritten = WIZARD_FILES[wizardId] || [];
    for (let row of files) {
        if (row.exists !== true) continue;
        let path = row.path.toLowerCase();
        row.rewritten = rewritten.some(entry => {
            if (entry.pack !== row.pack) return false;
            let wanted = entry.path.split('{f}').join(stem).toLowerCase();
            return wanted.endsWith('/') ? path.startsWith(wanted) : path === wanted;
        });
    }
}

// =========================
// Notes
// =========================
const ARMOR_WEARABLE_SLOTS = ['slot.armor.head', 'slot.armor.chest', 'slot.armor.legs', 'slot.armor.feet', 'slot.armor.body'];
const OFFHAND_WEARABLE_SLOT = 'slot.weapon.offhand';
const MOUNT_SLOTS = ['slot.saddle', 'slot.armor', 'slot.chest'];

function buildNotes(scan) {
    let notes = [];
    let project = scan.project;
    if (scan.kind === 'unknown' && project.format && project.format.id === ENTITY_FORMAT_ID) {
        notes.push({ id: 'no_entity_file', values: { identifier: getWrittenGeometryId(project) } });
    }
    let components = scan.item ? getItemComponents(scan.item.content) : null;
    if (components) {
        let wearable = components['minecraft:wearable'];
        let slot = isPlainObject(wearable) && typeof wearable.slot === 'string' ? wearable.slot : null;
        if (ARMOR_WEARABLE_SLOTS.includes(slot)) notes.push({ id: 'wearable_armor', values: { slot } });
        else if (slot === OFFHAND_WEARABLE_SLOT) notes.push({ id: 'wearable_offhand', values: {} });
        else if (MOUNT_SLOTS.includes(slot)) notes.push({ id: 'mount_slot', values: { slot } });
        if (readComponentValue(components['minecraft:hand_equipped']) === true) notes.push({ id: 'hand_equipped', values: {} });
    }
    let description = scan.kind === 'attachable' && scan.entityFile ? scan.entityFile.description : null;
    let materials = description && isPlainObject(description.materials) ? description.materials : null;
    let glintMaterial = !!materials && typeof materials.default === 'string' && materials.default.includes('glint');
    if (glintMaterial || (components && readComponentValue(components['minecraft:glint']) === true)) {
        notes.push({ id: 'glint', values: {} });
    }
    let useAnimation = components ? readComponentValue(components['minecraft:use_animation']) : null;
    if (useAnimation === 'eat' || useAnimation === 'drink') notes.push({ id: 'use_animation', values: { animation: useAnimation } });
    let preset = scan.geometryFile ? findItemWizardPreset(scan.geometryFile.geometry) : null;
    if (preset) notes.push({ id: 'own_model', values: { preset } });
    let exportPath = scan.project.export_path;
    if (exportPath && isInsideFolder(scan.roots.rp, exportPath)) {
        notes.push({ id: 'saves_into', values: { path: relativePackPath(scan.roots.rp, exportPath) } });
    }
    if (scan.wizard) notes.push({ id: 'reexport', values: { wizard: scan.wizard } });
    return notes;
}

// =========================
// Scanning
// =========================
let linkCache = new WeakMap();
let pendingScans = new Map();

function getLinkKey(project) {
    return [project.format ? project.format.id : '', project.export_path, project.save_path, project.geometry_name].join('|');
}

function createEmptyView(status) {
    return { status, rp: null, bp: null, stamps: [], kind: null, wizard: null, files: [], notes: [] };
}

function findModelKind(scan) {
    let project = scan.project;
    if (project.format && project.format.id === BLOCK_FORMAT_ID) return 'block';
    if (!project.format || project.format.id !== ENTITY_FORMAT_ID) return 'unknown';
    if (scan.entityFile) return scan.entityFile.kind;
    let folderKind = scan.geometryFile ? kindFromFolder(relativePackPath(scan.roots.rp, scan.geometryFile.path)) : null;
    return readBlockbenchEntityKind(project) || folderKind || 'unknown';
}

function readWearInfo(scan) {
    let description = scan.kind === 'attachable' && scan.entityFile ? scan.entityFile.description : null;
    let components = scan.item ? getItemComponents(scan.item.content) : null;
    if (!description && !components) return null;
    let wearable = components ? components['minecraft:wearable'] : null;
    let slot = isPlainObject(wearable) && typeof wearable.slot === 'string' ? wearable.slot : null;
    let scripts = description && isPlainObject(description.scripts) ? description.scripts : null;
    let parentSetup = scripts ? scripts.parent_setup : null;
    if (Array.isArray(parentSetup)) parentSetup = parentSetup.filter(line => typeof line === 'string').join('\n');
    if (typeof parentSetup !== 'string') parentSetup = null;
    let renderControllers = description ? getRenderControllerIds(description.render_controllers) : [];
    return { slot, parentSetup, renderControllers };
}

function buildLinkEntry(project) {
    let unlinked = status => ({ view: createEmptyView(status), entityKind: null, wear: null, attachable: null, animationFiles: {} });
    if (!isDesktopApp()) return unlinked('desktop_only');
    let startPath = getStartPath(project);
    if (!startPath) return unlinked('no_path');
    let rp = findResourcePackRoot(startPath);
    if (!rp) return unlinked('not_in_pack');
    let bp = findBehaviorPack(rp.path, rp.manifest);

    let scan = {
        project,
        roots: { rp: rp.path, bp: bp.path },
        listings: new Map(),
        files: [],
        rowKeys: new Set(),
        geometryFile: null,
        entityFile: null,
        item: null,
        kind: 'unknown',
        stem: '',
        wizard: null,
        animationFiles: {}
    };
    scan.geometryFile = findGeometryFile(scan);
    scan.stem = scan.geometryFile ? getGeometryFileStem(scan.geometryFile.path) : (project.geometry_name || '');
    if (project.format && project.format.id === ENTITY_FORMAT_ID) {
        scan.entityFile = classifyEntityFile(rp.path, project.geometry_name, readBlockbenchEntityKind(project));
    }
    scan.kind = findModelKind(scan);

    let stamps = mergeStamps(readWizardStamps(rp.manifest), readWizardStamps(bp.manifest));
    let wizard = WIZARDS.find(entry => entry.modelKind === scan.kind && stamps.some(stamp => stamp.wizard === entry.id));
    scan.wizard = wizard ? wizard.id : null;

    if (scan.kind === 'attachable') listAttachableFiles(scan);
    else if (scan.kind === 'entity') listEntityFiles(scan);
    else if (scan.kind === 'block') listBlockFiles(scan);
    else addGeometryRow(scan);
    addPackFiles(scan);
    if (scan.wizard) markRewrittenFiles(scan.files, scan.wizard, scan.stem);

    let view = {
        status: 'linked',
        rp: { name: PathModule.basename(rp.path), path: rp.path },
        bp: { name: bp.name, path: bp.path, status: bp.status, candidates: bp.candidates },
        stamps,
        kind: scan.kind,
        wizard: scan.wizard,
        files: scan.files,
        notes: buildNotes(scan)
    };
    return {
        view,
        entityKind: scan.entityFile ? scan.entityFile.kind : null,
        wear: readWearInfo(scan),
        attachable: scan.kind === 'attachable' && scan.entityFile ? { path: scan.entityFile.path, description: scan.entityFile.description } : null,
        animationFiles: scan.animationFiles
    };
}

function scanPackLink(project = Project) {
    if (!project) return null;
    let entry;
    try {
        entry = buildLinkEntry(project);
    } catch (error) {
        console.warn(LOG_PREFIX, 'Could not read the pack of this project:', error);
        entry = { view: createEmptyView('error'), entityKind: null, wear: null, attachable: null, animationFiles: {} };
    }
    entry.key = getLinkKey(project);
    linkCache.set(project, entry);
    for (let listener of packScanListeners.slice()) listener(project);
    return cloneJson(entry.view);
}

let packScanListeners = [];

function onPackLinkScanned(listener) {
    packScanListeners.push(listener);
    return {
        delete() {
            packScanListeners = packScanListeners.filter(entry => entry !== listener);
        }
    };
}

function requestPackLinkScan(project = Project, force = false) {
    if (!project || pendingScans.has(project)) return;
    let entry = linkCache.get(project);
    if (!force && entry && entry.key === getLinkKey(project)) return;
    let timer = setTimeout(() => {
        pendingScans.delete(project);
        if (!ModelProject.all.includes(project)) return;
        scanPackLink(project);
        refreshPanelSafely();
    }, 0);
    pendingScans.set(project, timer);
}

function refreshPackLink(project = Project) {
    forgetRememberedSearches();
    requestPackLinkScan(project, true);
}

function isPackScanNeededForRoute(project = Project) {
    return !!project && !!project.format && project.format.id === ENTITY_FORMAT_ID && !readBlockbenchEntityKind(project);
}

function getPackLinkView(project = Project) {
    let entry = project ? linkCache.get(project) : null;
    if (!entry || !entry.view) return null;
    let view = cloneJson(entry.view);
    if (project === Project && view.status === 'linked' && view.wizard === 'block') {
        let losses = getBlockWizardVersionLosses(buildItemDisplayTransforms());
        if (losses.length) view.notes.push({ id: 'block_wizard_version', values: { losses } });
    }
    return view;
}

function getLinkedEntityKind(project) {
    let entry = project ? linkCache.get(project) : null;
    return entry ? entry.entityKind : null;
}

function getLinkedWearInfo(project = Project) {
    let entry = project ? linkCache.get(project) : null;
    return entry && entry.wear ? cloneJson(entry.wear) : null;
}

function getLinkedAttachable(project = Project) {
    let entry = project ? linkCache.get(project) : null;
    return entry && entry.attachable ? cloneJson(entry.attachable) : null;
}

function getLinkedAnimationFiles(project = Project) {
    let entry = project ? linkCache.get(project) : null;
    return entry && entry.animationFiles ? Object.assign({}, entry.animationFiles) : {};
}

// =========================
// Reading a file as text
// =========================
function readPackTextFile(path) {
    if (!isDesktopApp() || typeof path !== 'string' || !PathModule.isAbsolute(path)) return null;
    let found = findFiles([PathModule.dirname(path)], { filter_regex: exactNameRegex(PathModule.basename(path)), recursive: false },
        (filePath, content) => (typeof content === 'string' ? { content } : false));
    return found ? found.content : null;
}

// =========================
// Opening a pack folder
// =========================
function openPackFolder(which = 'rp', project = Project) {
    let entry = project ? linkCache.get(project) : null;
    let pack = entry && entry.view ? entry.view[which === 'bp' ? 'bp' : 'rp'] : null;
    if (!pack || !pack.path || typeof Filesystem === 'undefined' || typeof Filesystem.showFileInFolder !== 'function') return false;
    Filesystem.showFileInFolder(joinPackPath(pack.path, 'manifest.json'));
    return true;
}

// =========================
// Install
// =========================
function installPackLink() {
    let hooks = createDeletables([createSaveGuardListener]);
    return {
        delete() {
            hooks.delete();
            for (let timer of pendingScans.values()) clearTimeout(timer);
            pendingScans = new Map();
            packScanListeners = [];
            linkCache = new WeakMap();
            forgetRememberedSearches();
            bypassSaveGuard = false;
            overwriteDepth = 0;
            dismissedSaveWarnings = new WeakSet();
            itemWizardNoticeProjects = new WeakSet();
            blockWizardNoticeProjects = new WeakSet();
        }
    };
}

registerModuleInstaller('pack_link', installPackLink);

// ---- src/block_route.js ----

// =========================
// Constants
// =========================
const OTHER_HAND_SLOT = {
    thirdperson_righthand: 'thirdperson_lefthand',
    thirdperson_lefthand: 'thirdperson_righthand',
    firstperson_righthand: 'firstperson_lefthand',
    firstperson_lefthand: 'firstperson_righthand'
};

const HAND_SLOTS = ['thirdperson_righthand', 'thirdperson_lefthand', 'firstperson_righthand', 'firstperson_lefthand'];

const FIRST_PERSON_FOR_THIRD_PERSON = {
    firstperson_righthand: 'thirdperson_righthand',
    firstperson_lefthand: 'thirdperson_lefthand'
};

const BEDROCK_DEFAULTS_PRESET_ID = 'bedrock_defaults';

const BEDROCK_PRESET_FOR_BLOCKBENCH = {
    block: BEDROCK_DEFAULTS_PRESET_ID,
    item: 'item_hold',
    handheld: 'tool_hold',
    rod: 'rod_hold',
    armor_stand: 'armor_stand_statue'
};

const VALUE_EPSILON = 1e-6;

const TURN_AXES = ['x', 'y', 'z'];

const GEOMETRY_MILESTONES = [FIT_TO_FRAME_GEOMETRY_VERSION, ITEM_FRAME_GEOMETRY_VERSION, SHELF_GEOMETRY_VERSION];

function isBlockRouteActive() {
    return getRoute() === 'block' && !!Project;
}

// =========================
// Comparing values
// =========================
function sameNumber(a, b) {
    return Math.abs(a - b) < VALUE_EPSILON;
}

function sameAngle(a, b) {
    return Math.abs(((a - b) % 360 + 540) % 360 - 180) < VALUE_EPSILON;
}

function sameVector(a, b, compare = sameNumber) {
    return [0, 1, 2].every(axis => compare(a[axis], b[axis]));
}

function sameChannelValues(channel, a, b) {
    return sameVector(a, b, channel === 'rotation' ? sameAngle : sameNumber);
}

function isZeroVector(vector) {
    return sameVector(vector, [0, 0, 0]);
}

// =========================
// Slot values
// =========================
function engineDefaultsFor(slotId) {
    let defaults = getEngineDefaults()[slotId] || {};
    return {
        translation: defaults.translation || [0, 0, 0],
        rotation: defaults.rotation || [0, 0, 0],
        scale: defaults.scale || [1, 1, 1],
        rotation_pivot: [0, 0, 0],
        scale_pivot: [0, 0, 0]
    };
}

function matchesEngineDefaults(slot) {
    let defaults = engineDefaultsFor(slot.slot_id);
    return SLOT_CHANNELS.every(channel => sameChannelValues(channel, slot[channel], defaults[channel])) &&
        !slot.mirror.some(Boolean);
}

function isUntouchedBlockbenchSlot(slot) {
    let defaultScalePivot = isZeroVector(slot.scale_pivot) ||
        (slot.slot_id === 'embedded' && sameVector(slot.scale_pivot, [0, -0.5, 0]));
    return isZeroVector(slot.translation) &&
        isZeroVector(slot.rotation) &&
        sameVector(slot.scale, [1, 1, 1]) &&
        isZeroVector(slot.rotation_pivot) &&
        defaultScalePivot &&
        !slot.mirror.some(Boolean);
}

function usesEngineValues(slotId) {
    if (!getProjectData().inherit[slotId]) return false;
    let slot = Project.display_settings[slotId];
    return !slot || matchesEngineDefaults(slot) || isUntouchedBlockbenchSlot(slot);
}

function isSlotInherited(slotId) {
    if (!isBlockRouteActive() || !findBedrockSlot(slotId)) return null;
    if (slotId === 'gui' && !getProjectData().gui_fit_to_frame) return false;
    return usesEngineValues(slotId);
}

function readSlotValues(slotId) {
    let slot = Project.display_settings[slotId];
    if (!slot || usesEngineValues(slotId)) return engineDefaultsFor(slotId);
    let values = {};
    for (let channel of SLOT_CHANNELS) {
        values[channel] = slot[channel].slice();
    }
    return values;
}

function getSlotValues(slotId) {
    if (!isBlockRouteActive() || !findBedrockSlot(slotId)) return null;
    let values = readSlotValues(slotId);
    if (slotId === 'gui') values.fit_to_frame = getProjectData().gui_fit_to_frame;
    return values;
}

let seededSlots = new WeakSet();

function seedEngineDefaults(slot) {
    let defaults = engineDefaultsFor(slot.slot_id);
    slot.extend(Object.assign(defaults, { mirror: [false, false, false] }));
    seededSlots.add(slot);
}

// =========================
// Mirrored values become 180° turns (Bedrock has no negative scale)
// =========================
const THIN_AXIS_ORDER = [2, 1, 0];

const SIZE_EPSILON = 0.001;

function isLeftHandSlot(slotId) {
    let slot = findBedrockSlot(slotId);
    return !!slot && slot.hand === 'left';
}

function turnedRotation(rotation, axisIndex) {
    let [x, y, z] = rotation;
    let turned;
    if (axisIndex === 0) {
        turned = [x + 180, -y, -z];
    } else if (axisIndex === 1) {
        turned = [x, y + 180, -z];
    } else {
        turned = [x, y, z + 180];
    }
    return turned.map(value => wrapAngle(value) + 0);
}

function drawnRotationMatrix(slotId, rotation) {
    let side = isLeftHandSlot(slotId) ? -1 : 1;
    let toRadians = Math.PI / 180;
    let euler = new THREE.Euler(rotation[0] * toRadians, rotation[1] * toRadians * side, rotation[2] * toRadians * side, 'XYZ');
    return new THREE.Matrix4().makeRotationFromEuler(euler);
}

function rotatedPivot(matrix, pivot) {
    return new THREE.Vector3(pivot[0], pivot[1], pivot[2]).multiplyScalar(16).applyMatrix4(matrix);
}

function translationKeepingPlace(slotId, values, newRotation) {
    if (isZeroVector(values.rotation_pivot) && isZeroVector(values.scale_pivot)) return values.translation.slice();
    let side = isLeftHandSlot(slotId) ? -1 : 1;
    let before = drawnRotationMatrix(slotId, values.rotation);
    let after = drawnRotationMatrix(slotId, newRotation);
    let drawn = new THREE.Vector3(values.translation[0] * side, values.translation[1], values.translation[2]);
    drawn.add(rotatedPivot(after, values.rotation_pivot).sub(rotatedPivot(before, values.rotation_pivot)));
    let scaleShift = rotatedPivot(after, values.scale_pivot).sub(rotatedPivot(before, values.scale_pivot));
    drawn.x -= scaleShift.x * (1 - values.scale[0]);
    drawn.y -= scaleShift.y * (1 - values.scale[1]);
    drawn.z -= scaleShift.z * (1 - values.scale[2]);
    return [drawn.x * side, drawn.y, drawn.z].map(value => Math.round(value * 1e9) / 1e9 + 0);
}

function thinnestAxis(candidates, size) {
    let ordered = THIN_AXIS_ORDER.filter(axis => candidates.includes(axis));
    return ordered.reduce((best, axis) => (size[axis] < size[best] - SIZE_EPSILON ? axis : best));
}

function chooseMirrorTurn(flags, getSize) {
    let flipped = [0, 1, 2].filter(axis => flags[axis]);
    if (flipped.length === 2) {
        return { axis: [0, 1, 2].find(axis => !flags[axis]), leftover: null, exact: true };
    }
    let candidates = flipped.length === 1 ? [0, 1, 2].filter(axis => axis !== flipped[0]) : [0, 1, 2];
    let leftover = thinnestAxis(candidates, getSize());
    let axis = flipped.length === 1 ? candidates.find(candidate => candidate !== leftover) : leftover;
    return { axis, leftover, exact: false };
}

function computeMirrorTurn(slotId, values, flags, getSize) {
    if (!flags.some(Boolean)) return null;
    let turn = chooseMirrorTurn(flags, getSize);
    let rotation = turnedRotation(values.rotation, turn.axis);
    let translation = translationKeepingPlace(slotId, values, rotation).map(value => sanitizeSlotValue('translation', value));
    return { turn, rotation, translation };
}

function measureModelSize() {
    let root = Project && Project.model_3d;
    let box = new THREE.Box3();
    if (!root) return [0, 0, 0];
    root.updateMatrixWorld(true);
    let toModel = new THREE.Matrix4().copy(root.matrixWorld).invert();
    for (let element of Outliner.elements) {
        let mesh = element.mesh;
        if ((element.type !== 'cube' && element.type !== 'mesh') || element.export === false || !mesh || !mesh.geometry) continue;
        mesh.geometry.computeBoundingBox();
        if (!mesh.geometry.boundingBox) continue;
        let toElement = new THREE.Matrix4().multiplyMatrices(toModel, mesh.matrixWorld);
        box.union(mesh.geometry.boundingBox.clone().applyMatrix4(toElement));
    }
    if (box.isEmpty()) return [0, 0, 0];
    let size = box.getSize(new THREE.Vector3());
    return [size.x, size.y, size.z];
}

function measureGeometrySize(geometry) {
    let min = [Infinity, Infinity, Infinity];
    let max = [-Infinity, -Infinity, -Infinity];
    let include = (axis, value) => {
        if (typeof value !== 'number' || !Number.isFinite(value)) return;
        min[axis] = Math.min(min[axis], value);
        max[axis] = Math.max(max[axis], value);
    };
    let bones = geometry && Array.isArray(geometry.bones) ? geometry.bones : [];
    for (let bone of bones) {
        if (!isPlainObject(bone)) continue;
        for (let cube of Array.isArray(bone.cubes) ? bone.cubes : []) {
            if (!isPlainObject(cube) || !Array.isArray(cube.origin) || !Array.isArray(cube.size)) continue;
            let inflate = typeof cube.inflate === 'number' ? cube.inflate : 0;
            for (let axis of [0, 1, 2]) {
                include(axis, cube.origin[axis] - inflate);
                include(axis, cube.origin[axis] + cube.size[axis] + inflate);
            }
        }
        let positions = isPlainObject(bone.poly_mesh) && Array.isArray(bone.poly_mesh.positions) ? bone.poly_mesh.positions : [];
        for (let position of positions) {
            if (Array.isArray(position)) [0, 1, 2].forEach(axis => include(axis, position[axis]));
        }
    }
    return [0, 1, 2].map(axis => (max[axis] >= min[axis] ? max[axis] - min[axis] : 0));
}

function convertMirrorToTurn(slot, modelSize) {
    if (!slot || !Array.isArray(slot.mirror) || !slot.mirror.some(Boolean)) return null;
    let values = {};
    for (let channel of SLOT_CHANNELS) {
        values[channel] = slot[channel].slice();
    }
    let result = computeMirrorTurn(slot.slot_id, values, slot.mirror, () => modelSize || measureModelSize());
    slot.rotation.replace(result.rotation);
    slot.translation.replace(result.translation);
    slot.mirror.replace([false, false, false]);
    return result.turn;
}

function reportMirrorTurns(turns, notify = false) {
    let made = turns.filter(Boolean);
    if (!made.length) return;
    let approximate = made.find(turn => !turn.exact);
    if (approximate) {
        showNotification('mirror', i18nFormat('display_sensei.message.mirror_approximated', {
            axis: TURN_AXES[approximate.axis].toUpperCase(),
            leftover: TURN_AXES[approximate.leftover].toUpperCase()
        }));
    } else if (notify) {
        showNotification('mirror', i18n('display_sensei.message.mirror_converted'));
    } else {
        showMessage('display_sensei.message.mirror_converted');
    }
}

function ensureSlot(slotId) {
    if (!isBlockRouteActive() || !findBedrockSlot(slotId)) return null;
    let data = getProjectData();
    let slot = Project.display_settings[slotId];
    if (!slot) {
        slot = Project.display_settings[slotId] = new DisplaySlot(slotId);
        seedEngineDefaults(slot);
    } else {
        reportMirrorTurns([convertMirrorToTurn(slot)]);
        if (data.inherit[slotId] && isUntouchedBlockbenchSlot(slot)) seedEngineDefaults(slot);
    }
    if (slotId === 'gui') slot.fit_to_frame = data.gui_fit_to_frame;
    return slot;
}

// =========================
// Undo steps
// =========================
let openSlotEdit = null;

function isOwnSlotEditOpen() {
    return !!openSlotEdit && openSlotEdit.project === Project && Undo.current_save === openSlotEdit.save;
}

let isFinishingOwnEdit = false;

function finishOwnEdit(label) {
    isFinishingOwnEdit = true;
    try {
        Undo.finishEdit(label);
    } finally {
        isFinishingOwnEdit = false;
    }
}

function includeSlotsInEdit(save, slotIds) {
    let recorded = save.aspects.display_slots || [];
    let added = slotIds.filter(slotId => !recorded.includes(slotId));
    if (!added.length) return;
    save.aspects.display_slots = recorded.concat(added);
    if (!save.display_slots) save.display_slots = {};
    for (let slotId of added) {
        save.display_slots[slotId] = Project.display_settings[slotId].copy();
    }
    if (!(PROJECT_DATA_KEY in save)) save[PROJECT_DATA_KEY] = cloneJson(getProjectData());
}

function slotEditChanged(save) {
    let slotIds = save.aspects.display_slots || [];
    let slotChanged = slotIds.some(slotId => {
        let slot = Project.display_settings[slotId];
        return JSON.stringify(save.display_slots[slotId]) !== JSON.stringify(slot ? slot.copy() : null);
    });
    return slotChanged ||
        (PROJECT_DATA_KEY in save && JSON.stringify(save[PROJECT_DATA_KEY]) !== JSON.stringify(getProjectData()));
}

function isIdleForeignEdit(save) {
    if (Transformer.dragging) return false;
    let aspects = Object.keys(save.aspects || {}).filter(name => save.aspects[name]);
    if (aspects.some(name => name !== 'display_slots')) return false;
    return !slotEditChanged(save);
}

function recordOwnEdit(aspects, undoLabel, change) {
    let save = Undo.initEdit(aspects);
    try {
        change();
    } catch (error) {
        Undo.cancelEdit(true);
        throw error;
    }
    if (slotEditChanged(save)) {
        finishOwnEdit(undoLabel);
    } else {
        Undo.cancelEdit(false);
    }
}

function runSlotEdit(slotIds, undoLabel, change) {
    slotIds.forEach(ensureSlot);
    let save = Undo.current_save;
    if (isOwnSlotEditOpen() || (save && !isIdleForeignEdit(save))) {
        includeSlotsInEdit(save, slotIds);
        change();
    } else {
        recordOwnEdit({ display_slots: slotIds.slice() }, undoLabel, change);
    }
    refreshDisplayPreview(slotIds);
}

function runProjectDataEdit(undoLabel, change) {
    let save = Undo.current_save;
    if (isOwnSlotEditOpen() || (save && !isIdleForeignEdit(save))) {
        change();
    } else {
        recordOwnEdit({ [PROJECT_DATA_UNDO_ASPECT]: true }, undoLabel, change);
    }
    refreshDisplayPreview();
}

function normalizeSlotIds(slotIds) {
    let ids = Array.isArray(slotIds) ? slotIds : BEDROCK_SLOTS.map(slot => slot.id);
    return ids.filter((slotId, index) => findBedrockSlot(slotId) && ids.indexOf(slotId) === index);
}

function beginSlotEdit(slotIds) {
    if (!isBlockRouteActive()) return false;
    let ids = normalizeSlotIds(slotIds);
    if (!ids.length) return false;
    ids.forEach(ensureSlot);
    if (isOwnSlotEditOpen()) {
        includeSlotsInEdit(Undo.current_save, ids);
        return true;
    }
    if (Undo.current_save && !isIdleForeignEdit(Undo.current_save)) return false;
    openSlotEdit = { save: Undo.initEdit({ display_slots: ids }), project: Project };
    return true;
}

function takeOpenSlotEdit() {
    let edit = openSlotEdit;
    openSlotEdit = null;
    if (!edit || edit.project.undo.current_save !== edit.save) return null;
    if (edit.project !== Project) {
        edit.project.undo.cancelEdit(false);
        return null;
    }
    return edit;
}

function finishSlotEdit(label) {
    let edit = takeOpenSlotEdit();
    if (!edit) return false;
    if (!slotEditChanged(edit.save)) {
        Undo.cancelEdit(false);
        return false;
    }
    finishOwnEdit(label || i18n('display_sensei.undo.edit_slot'));
    refreshPanel();
    return true;
}

function cancelSlotEdit() {
    if (!takeOpenSlotEdit()) return false;
    Undo.cancelEdit(true);
    refreshDisplayPreview();
    return true;
}

// =========================
// Editing slots
// =========================
function wrapAngle(value) {
    if (value >= -180 && value < 180) return value;
    let wrapped = value - 360 * Math.floor((value + 180) / 360);
    return Math.round(wrapped * 1e9) / 1e9;
}

function sanitizeSlotValue(channel, value) {
    if (channel === 'rotation') return wrapAngle(value);
    let number = channel === 'scale' ? Math.abs(value) : value;
    return clampToRange(number, SLOT_RANGES[channel]);
}

function sanitizeOrKeep(channel, value, current) {
    let number = typeof value === 'number' ? value : parseFloat(value);
    return Number.isFinite(number) ? sanitizeSlotValue(channel, number) : current;
}

function sanitizeVector(channel, values) {
    return values.map(value => sanitizeOrKeep(channel, value, 0));
}

function forgetUnsetFields(data, slotId, fields) {
    let unset = data.unset_fields[slotId];
    if (!unset) return;
    let remaining = unset.filter(field => !fields.includes(field));
    if (remaining.length) {
        data.unset_fields[slotId] = remaining;
    } else {
        delete data.unset_fields[slotId];
    }
}

function markSlotEdited(slotId, fields = FALLBACK_FIELDS) {
    reportMirrorTurns([convertMirrorToTurn(Project.display_settings[slotId])]);
    let data = getProjectData();
    data.inherit[slotId] = false;
    forgetUnsetFields(data, slotId, fields);
}

function writeSlotChannel(slot, channel, values) {
    slot[channel].replace(slot[channel].map((current, axis) => sanitizeOrKeep(channel, values[axis], current)));
}

function hasNumber(values) {
    return values.some(value => Number.isFinite(typeof value === 'number' ? value : parseFloat(value)));
}

function setSlotChannel(slotId, channel, values) {
    if (!isBlockRouteActive() || !findBedrockSlot(slotId) || !SLOT_CHANNELS.includes(channel)) return false;
    if (!Array.isArray(values) || !hasNumber(values)) return false;
    runSlotEdit([slotId], i18n('display_sensei.undo.edit_slot'), () => {
        writeSlotChannel(Project.display_settings[slotId], channel, values);
        markSlotEdited(slotId, [channel]);
    });
    return true;
}

function setSlotAxis(slotId, channel, axisIndex, value) {
    if (![0, 1, 2].includes(axisIndex)) return false;
    let values = [null, null, null];
    values[axisIndex] = value;
    return setSlotChannel(slotId, channel, values);
}

function getChannelDefault(slotId, channel) {
    if (!isBlockRouteActive() || !findBedrockSlot(slotId) || !SLOT_CHANNELS.includes(channel)) return null;
    return engineDefaultsFor(slotId)[channel].slice();
}

function leaveFieldToGame(slotId, channel) {
    let data = getProjectData();
    data.inherit[slotId] = false;
    if (!FALLBACK_FIELDS.includes(channel)) return;
    let unset = data.unset_fields[slotId] || [];
    if (!unset.includes(channel)) data.unset_fields[slotId] = unset.concat([channel]);
}

function resetSlotChannel(slotId, channel) {
    let defaults = getChannelDefault(slotId, channel);
    if (!defaults) return false;
    runSlotEdit([slotId], i18n('display_sensei.undo.reset_channel'), () => {
        let slot = Project.display_settings[slotId];
        slot[channel].replace(defaults);
        let guiFits = slotId !== 'gui' || getProjectData().gui_fit_to_frame;
        if (guiFits && matchesEngineDefaults(slot)) {
            applyInherit(slotId, true);
        } else {
            leaveFieldToGame(slotId, channel);
        }
    });
    return true;
}

function applyInherit(slotId, inherited) {
    let data = getProjectData();
    if (inherited) {
        seedEngineDefaults(Project.display_settings[slotId]);
        if (slotId === 'gui') {
            data.gui_fit_to_frame = true;
            Project.display_settings.gui.fit_to_frame = true;
        }
    }
    data.inherit[slotId] = inherited;
    delete data.unset_fields[slotId];
}

function setSlotInherited(slotId, inherited) {
    if (!isBlockRouteActive() || !findBedrockSlot(slotId)) return false;
    let label = inherited ? i18n('display_sensei.undo.reset_slot') : i18n('display_sensei.undo.stop_inheriting');
    runSlotEdit([slotId], label, () => applyInherit(slotId, !!inherited));
    return true;
}

// =========================
// Hands
// =========================
function negatedHandValues(values) {
    let negated = cloneJson(values);
    negated.translation[0] *= -1;
    negated.rotation[1] *= -1;
    negated.rotation[2] *= -1;
    for (let channel of ['translation', 'rotation']) {
        negated[channel] = negated[channel].map(value => value + 0);
    }
    return negated;
}

function copyFromOtherHand(slotId, negate, undoKey) {
    let otherSlotId = OTHER_HAND_SLOT[slotId];
    if (!isBlockRouteActive() || !otherSlotId) return false;
    ensureSlot(otherSlotId);
    let values = readSlotValues(otherSlotId);
    if (negate) values = negatedHandValues(values);
    runSlotEdit([slotId], i18n(undoKey), () => {
        let slot = Project.display_settings[slotId];
        for (let channel of SLOT_CHANNELS) {
            writeSlotChannel(slot, channel, values[channel]);
        }
        markSlotEdited(slotId);
    });
    return true;
}

function mirrorFromOtherHand(slotId) {
    return copyFromOtherHand(slotId, LEFT_HAND_RULE !== 'mirror', 'display_sensei.undo.mirror_slot');
}

function samePoseFromOtherHand(slotId) {
    return copyFromOtherHand(slotId, LEFT_HAND_RULE === 'mirror', 'display_sensei.undo.same_pose_slot');
}

function getHandFallbackNote(slotId) {
    if (!isBlockRouteActive() || !isLeftHandSlot(slotId)) return null;
    if (isSlotInherited(slotId) !== true || isSlotInherited(OTHER_HAND_SLOT[slotId]) !== false) return null;
    return i18n('display_sensei.message.left_hand_inherits');
}

// =========================
// Turn 180°
// =========================
function turnSlot180(slotId, axis) {
    let axisIndex = TURN_AXES.indexOf(axis);
    if (!isBlockRouteActive() || !findBedrockSlot(slotId) || axisIndex < 0) return false;
    runSlotEdit([slotId], i18n('display_sensei.undo.turn_slot'), () => {
        let slot = Project.display_settings[slotId];
        slot.rotation.replace(turnedRotation(slot.rotation, axisIndex));
        markSlotEdited(slotId, ['rotation']);
    });
    return true;
}

// =========================
// Matching first person to third person
// =========================
const MATCH_FIRST_PERSON_DEFAULT_SLOT = 'firstperson_righthand';

const GIMBAL_EPSILON = 1e-6;

const NEAR_GIMBAL_DEGREES = 1;

function drawnSlotMatrix(slotId, values) {
    let side = isLeftHandSlot(slotId) ? -1 : 1;
    let pivotSide = side < 0 && LEFT_HAND_PIVOT_MIRROR ? -1 : 1;
    let toRadians = Math.PI / 180;
    let euler = new THREE.Euler(values.rotation[0] * toRadians, values.rotation[1] * toRadians * side, values.rotation[2] * toRadians * side, 'XYZ');
    let position = new THREE.Vector3(values.translation[0] * side, values.translation[1], values.translation[2]);
    let scale = values.scale.map(value => value || 0.001);
    let rotationPivot = values.rotation_pivot || [0, 0, 0];
    let scalePivot = values.scale_pivot || [0, 0, 0];
    if (!isZeroVector(rotationPivot)) {
        let offset = new THREE.Vector3(rotationPivot[0] * pivotSide, rotationPivot[1], rotationPivot[2]).multiplyScalar(16);
        position.sub(offset.clone().applyEuler(euler).sub(offset));
    }
    if (!isZeroVector(scalePivot)) {
        let offset = new THREE.Vector3(scalePivot[0] * pivotSide, scalePivot[1], scalePivot[2]).multiplyScalar(16).applyEuler(euler);
        position.add(new THREE.Vector3(offset.x * (1 - scale[0]), offset.y * (1 - scale[1]), offset.z * (1 - scale[2])));
    }
    return new THREE.Matrix4().compose(position, new THREE.Quaternion().setFromEuler(euler), new THREE.Vector3().fromArray(scale));
}

function preferredEulerDegrees(quaternion) {
    let m = new THREE.Matrix4().makeRotationFromQuaternion(quaternion).elements;
    let toDegrees = 180 / Math.PI;
    let cosY = Math.hypot(m[0], m[4]);
    if (cosY < GIMBAL_EPSILON) {
        return [Math.atan2(m[6], m[5]) * toDegrees, Math.sign(m[8]) * 90, 0].map(wrapAngle);
    }
    let first = [Math.atan2(-m[9], m[10]), Math.atan2(m[8], cosY), Math.atan2(-m[4], m[0])].map(angle => wrapAngle(angle * toDegrees));
    let second = [first[0] + 180, 180 - first[1], first[2] + 180].map(wrapAngle);
    let size = angles => angles.reduce((sum, angle) => sum + Math.abs(angle), 0);
    return size(second) < size(first) - VALUE_EPSILON ? second : first;
}

function foldNearGimbal(angles) {
    let side = Math.sign(angles[1]);
    let change = Math.abs(Math.abs(angles[1]) - 90);
    if (!side || change > NEAR_GIMBAL_DEGREES) return null;
    let rotation = [angles[0] + side * angles[2], side * 90, 0].map(value => sanitizeSlotValue('rotation', roundToFour(value)) + 0);
    return { rotation, change: roundToFour(change) };
}

function valuesFromDrawnMatrix(slotId, matrix) {
    let side = isLeftHandSlot(slotId) ? -1 : 1;
    let position = new THREE.Vector3();
    let quaternion = new THREE.Quaternion();
    let scale = new THREE.Vector3();
    matrix.decompose(position, quaternion, scale);
    let rotation = preferredEulerDegrees(quaternion);
    let folded = foldNearGimbal(rotation);
    if (folded) rotation = folded.rotation;
    let rounded = {
        translation: [position.x * side, position.y, position.z].map(roundToFour),
        rotation: [rotation[0], rotation[1] * side, rotation[2] * side].map(roundToFour),
        scale: scale.toArray().map(roundToFour)
    };
    let clean = channel => rounded[channel].map(value => sanitizeSlotValue(channel, value) + 0);
    let values = {
        translation: clean('translation'),
        rotation: clean('rotation'),
        scale: clean('scale'),
        rotation_pivot: [0, 0, 0],
        scale_pivot: [0, 0, 0]
    };
    let clamped = !sameVector(values.translation, rounded.translation) || !sameVector(values.scale, rounded.scale);
    return { values, clamped, turned: folded ? folded.change : 0 };
}

function computeFirstPersonMatch(slotId, thirdPersonValues) {
    let thirdPersonSlotId = FIRST_PERSON_FOR_THIRD_PERSON[slotId];
    if (!thirdPersonSlotId || !isPlainObject(thirdPersonValues)) return null;
    let values = {};
    for (let channel of SLOT_CHANNELS) {
        let fallback = engineDefaultsFor(thirdPersonSlotId)[channel];
        values[channel] = Array.isArray(thirdPersonValues[channel]) ? sanitizeVector(channel, thirdPersonValues[channel]) : fallback;
    }
    let firstPersonDefault = drawnSlotMatrix(slotId, engineDefaultsFor(MATCH_FIRST_PERSON_DEFAULT_SLOT));
    let thirdPersonDefault = drawnSlotMatrix(thirdPersonSlotId, engineDefaultsFor(thirdPersonSlotId));
    let matrix = firstPersonDefault.multiply(thirdPersonDefault.invert()).multiply(drawnSlotMatrix(thirdPersonSlotId, values));
    return valuesFromDrawnMatrix(slotId, matrix);
}

function matchFirstPersonValues(slotId, thirdPersonValues) {
    let match = computeFirstPersonMatch(slotId, thirdPersonValues);
    return match ? match.values : null;
}

function showsThirdPersonDefault(thirdPersonSlotId) {
    let values = readSlotValues(thirdPersonSlotId);
    let defaults = engineDefaultsFor(thirdPersonSlotId);
    return SLOT_CHANNELS.every(channel => sameChannelValues(channel, values[channel], defaults[channel]));
}

function matchFirstPersonToThirdPerson() {
    if (!isBlockRouteActive()) return false;
    let result = { written: [], kept: [], clamped: [], turned: 0 };
    let matched = {};
    for (let [slotId, thirdPersonSlotId] of Object.entries(FIRST_PERSON_FOR_THIRD_PERSON)) {
        ensureSlot(thirdPersonSlotId);
        if (showsThirdPersonDefault(thirdPersonSlotId)) {
            result.kept.push(slotId);
            continue;
        }
        let match = computeFirstPersonMatch(slotId, readSlotValues(thirdPersonSlotId));
        matched[slotId] = match.values;
        result.written.push(slotId);
        if (match.clamped) result.clamped.push(slotId);
        result.turned = Math.max(result.turned, match.turned);
    }
    if (!result.written.length) return result;
    runSlotEdit(result.written, i18n('display_sensei.undo.match_first_person'), () => {
        for (let slotId of result.written) {
            let slot = Project.display_settings[slotId];
            for (let channel of SLOT_CHANNELS) {
                writeSlotChannel(slot, channel, matched[slotId][channel]);
            }
            markSlotEdited(slotId);
        }
    });
    return result;
}

// =========================
// Turning about the item's own axes, and rotations near Y ±90°
// =========================
function turnSlotAboutItemAxis(slotId, axis, degrees) {
    let axisIndex = TURN_AXES.indexOf(axis);
    let amount = Number(degrees);
    if (!isBlockRouteActive() || !findBedrockSlot(slotId) || axisIndex < 0 || !Number.isFinite(amount) || amount === 0) return false;
    ensureSlot(slotId);
    let toRadians = Math.PI / 180;
    let current = readSlotValues(slotId).rotation;
    let rotation = new THREE.Quaternion().setFromEuler(new THREE.Euler(current[0] * toRadians, current[1] * toRadians, current[2] * toRadians, 'XYZ'));
    let turn = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3().setComponent(axisIndex, 1), amount * toRadians);
    let turned = preferredEulerDegrees(rotation.multiply(turn)).map(value => sanitizeSlotValue('rotation', roundToFour(value)) + 0);
    runSlotEdit([slotId], i18n('display_sensei.undo.turn_item'), () => {
        Project.display_settings[slotId].rotation.replace(turned);
        markSlotEdited(slotId, ['rotation']);
    });
    return true;
}

function getGimbalState(slotId) {
    if (!isBlockRouteActive() || !findBedrockSlot(slotId)) return null;
    let rotation = readSlotValues(slotId).rotation;
    let folded = foldNearGimbal(rotation);
    if (!folded) return null;
    let tidy = sameVector(folded.rotation, rotation, sameAngle) ? null : folded.rotation;
    return { y: folded.rotation[1], change: folded.change, tidy };
}

function tidyNearGimbalRotation(slotId) {
    let state = getGimbalState(slotId);
    if (!state || !state.tidy) return null;
    runSlotEdit([slotId], i18n('display_sensei.undo.tidy_rotation'), () => {
        Project.display_settings[slotId].rotation.replace(state.tidy);
        markSlotEdited(slotId, ['rotation']);
    });
    return { rotation: state.tidy.slice(), change: state.change };
}

// =========================
// Presets
// =========================
function readPresetOfMenuEntry(entry) {
    let found = null;
    if (!entry || typeof entry.click !== 'function') return null;
    withTemporaryValue(DisplayMode, 'applyPreset', preset => {
        found = preset;
    }, () => entry.click());
    if (isPlainObject(found) && found[BEDROCK_MENU_PRESET_KEY]) return null;
    return isPlainObject(found) && isPlainObject(found.areas) ? found : null;
}

let isReadingBlockbenchPresets = false;

function readBlockbenchPresets() {
    let action = BarItems.apply_display_preset;
    if (!action || typeof action.children !== 'function') return [];
    let entries;
    isReadingBlockbenchPresets = true;
    try {
        entries = action.children();
    } finally {
        isReadingBlockbenchPresets = false;
    }
    return entries.map(readPresetOfMenuEntry).filter(Boolean);
}

const SAVED_PRESET_ID_PREFIX = 'saved_';
let savedPresetIds = new WeakMap();
let savedPresetCount = 0;
let savedPresets = {};

function getSavedPresetId(preset) {
    if (!savedPresetIds.has(preset)) {
        savedPresetCount++;
        savedPresetIds.set(preset, SAVED_PRESET_ID_PREFIX + savedPresetCount);
    }
    return savedPresetIds.get(preset);
}

// =========================
// Calibrated holds
// =========================
const CALIBRATED_HOLDS_STORAGE_KEY = 'display_sensei_calibrated_holds_v1';
const CALIBRATED_HOLD_RULE_KEY = 'left_hand_rule';
const FIRST_LEFT_HAND_RULE = 'mirror';

function isNumberVector(value) {
    return Array.isArray(value) && value.length === 3 && value.every(number => typeof number === 'number' && Number.isFinite(number));
}

function readCalibratedHolds() {
    let stored = null;
    try {
        stored = JSON.parse(localStorage.getItem(CALIBRATED_HOLDS_STORAGE_KEY));
    } catch (error) {
        stored = null;
    }
    let holds = {};
    if (!isPlainObject(stored)) return holds;
    for (let calibrationId of CALIBRATION_IDS) {
        let hands = stored[calibrationId];
        if (!isPlainObject(hands)) continue;
        let areas = {};
        for (let slotId of HAND_SLOTS) {
            let entry = hands[slotId];
            if (!isPlainObject(entry) || !FALLBACK_FIELDS.every(field => isNumberVector(entry[field]))) continue;
            areas[slotId] = {};
            for (let channel of SLOT_CHANNELS) {
                if (isNumberVector(entry[channel])) areas[slotId][channel] = entry[channel].slice();
            }
        }
        let rule = typeof hands[CALIBRATED_HOLD_RULE_KEY] === 'string' ? hands[CALIBRATED_HOLD_RULE_KEY] : FIRST_LEFT_HAND_RULE;
        if (Object.keys(areas).length) holds[calibrationId] = { areas, rule };
    }
    return holds;
}

function writeCalibratedHolds(holds) {
    let stored = {};
    for (let [calibrationId, hold] of Object.entries(holds)) {
        stored[calibrationId] = Object.assign({ [CALIBRATED_HOLD_RULE_KEY]: hold.rule }, hold.areas);
    }
    try {
        if (Object.keys(stored).length) {
            localStorage.setItem(CALIBRATED_HOLDS_STORAGE_KEY, JSON.stringify(stored));
        } else {
            localStorage.removeItem(CALIBRATED_HOLDS_STORAGE_KEY);
        }
        return true;
    } catch (error) {
        console.warn(LOG_PREFIX, 'Could not store the calibrated hold:', error);
        return false;
    }
}

function getCalibratedHold(calibrationId) {
    let hold = readCalibratedHolds()[calibrationId];
    return hold ? hold.areas : null;
}

function calibratedHoldRuleDiffers(calibrationId) {
    let hold = readCalibratedHolds()[calibrationId];
    return !!hold && hold.rule !== LEFT_HAND_RULE;
}

function hasCalibratedHold(calibrationId) {
    if (!CALIBRATION_IDS.includes(calibrationId)) return null;
    return !!getCalibratedHold(calibrationId);
}

function saveCalibratedHold(calibrationId) {
    if (!isBlockRouteActive() || !CALIBRATION_IDS.includes(calibrationId)) return false;
    let areas = {};
    for (let slotId of HAND_SLOTS) {
        ensureSlot(slotId);
        let values = readSlotValues(slotId);
        areas[slotId] = {};
        for (let channel of SLOT_CHANNELS) {
            areas[slotId][channel] = sanitizeVector(channel, values[channel]);
        }
    }
    let holds = readCalibratedHolds();
    holds[calibrationId] = { areas, rule: LEFT_HAND_RULE };
    if (!writeCalibratedHolds(holds)) return false;
    refreshPanel();
    return true;
}

function clearCalibratedHold(calibrationId) {
    if (!CALIBRATION_IDS.includes(calibrationId)) return false;
    let holds = readCalibratedHolds();
    if (!holds[calibrationId]) return false;
    delete holds[calibrationId];
    if (!writeCalibratedHolds(holds)) return false;
    refreshPanel();
    return true;
}

// =========================
// Bedrock presets
// =========================
function resolvePresetAreas(preset) {
    let calibrated = preset.calibration ? getCalibratedHold(preset.calibration) : null;
    if (calibrated) return cloneJson(calibrated);
    if (!preset.areas && !preset.standHands) return null;
    let areas = {};
    if (preset.standHands) {
        let hands = getStatueHandAreas(preset.standHands);
        if (!hands) return null;
        Object.assign(areas, hands);
    }
    if (preset.areas) Object.assign(areas, cloneJson(preset.areas));
    if (preset.matchFirstPerson) {
        for (let [slotId, thirdPersonSlotId] of Object.entries(FIRST_PERSON_FOR_THIRD_PERSON)) {
            if (isPlainObject(areas[thirdPersonSlotId])) areas[slotId] = matchFirstPersonValues(slotId, areas[thirdPersonSlotId]);
        }
    }
    return areas;
}

function usesCalibratedHold(preset) {
    return !!preset.calibration && !!getCalibratedHold(preset.calibration);
}

function describeBedrockPreset(preset) {
    let calibrated = usesCalibratedHold(preset);
    return {
        id: preset.id,
        label: i18n(preset.label),
        saved: false,
        group: preset.group,
        note: i18n(calibrated ? preset.calibratedNoteKey : preset.noteKey),
        estimate: preset.confidence === 'calibrated' && !calibrated,
        calibration: preset.calibration || null,
        calibrated,
        uncalibrated: !preset.inherit && !resolvePresetAreas(preset)
    };
}

function describeSavedPreset(preset, id) {
    let notes = [i18n('display_sensei.preset_note.saved')];
    let areas = Object.values(preset.areas).filter(isPlainObject);
    if (areas.some(area => presetMirrorFlags(area).some(Boolean))) notes.push(i18n('display_sensei.preset_note.saved_mirror'));
    return {
        id, label: String(preset.name || ''), saved: true, group: 'saved', note: notes.join(' '), estimate: false,
        calibration: null, calibrated: false, uncalibrated: false
    };
}

function getPresetChoices() {
    if (!isBlockRouteActive()) return null;
    let available = readBlockbenchPresets();
    let choices = BEDROCK_PRESETS
        .filter(preset => preset.inherit || preset.calibration || resolvePresetAreas(preset))
        .map(describeBedrockPreset);
    savedPresets = {};
    for (let preset of available) {
        if (preset.fixed) continue;
        let id = getSavedPresetId(preset);
        savedPresets[id] = preset;
        choices.push(describeSavedPreset(preset, id));
    }
    return choices;
}

function findSavedPreset(presetId) {
    return Object.prototype.hasOwnProperty.call(savedPresets, presetId) ? savedPresets[presetId] : null;
}

function presetMirrorFlags(area) {
    return [0, 1, 2].map(axis =>
        (Array.isArray(area.mirror) && area.mirror[axis] === true) ||
        (Array.isArray(area.scale) && typeof area.scale[axis] === 'number' && area.scale[axis] < 0));
}

function writePresetValues(slotId, area) {
    let slot = Project.display_settings[slotId];
    let written = [];
    for (let channel of SLOT_CHANNELS) {
        if (Array.isArray(area[channel])) {
            writeSlotChannel(slot, channel, area[channel]);
            written.push(channel);
        } else if (channel === 'rotation_pivot' || channel === 'scale_pivot') {
            slot[channel].replace([0, 0, 0]);
        }
    }
    let turn = null;
    let mirror = presetMirrorFlags(area);
    if (mirror.some(Boolean)) {
        slot.mirror.replace(mirror);
        turn = convertMirrorToTurn(slot);
        written.push('rotation', 'translation');
    }
    markSlotEdited(slotId, written);
    return turn;
}

function keepsBedrockDefault(slotId, area) {
    if (slotId === 'gui' && !getProjectData().gui_fit_to_frame) return false;
    if (presetMirrorFlags(area).some(Boolean)) return false;
    let defaults = engineDefaultsFor(slotId);
    return SLOT_CHANNELS.every(channel => {
        if (!Array.isArray(area[channel])) return channel === 'rotation_pivot' || channel === 'scale_pivot';
        return sameChannelValues(channel, sanitizeVector(channel, area[channel]), defaults[channel]);
    });
}

function applySavedPresetArea(preset, slotId) {
    let area = preset.areas[slotId];
    if (keepsBedrockDefault(slotId, area)) {
        applyInherit(slotId, true);
        return null;
    }
    return writePresetValues(slotId, area);
}

function notePresetLimits(preset, covered) {
    let effective = getEffectiveGeometryVersion();
    let wroteMatched = preset.matchFirstPerson && !usesCalibratedHold(preset) && covered.some(slotId => FIRST_PERSON_FOR_THIRD_PERSON[slotId]);
    if (usesCalibratedHold(preset) && calibratedHoldRuleDiffers(preset.calibration)) {
        showNotification('preset', i18n('display_sensei.message.calibrated_rule_differs'));
    } else if (wroteMatched) {
        showNotification('preset', i18n('display_sensei.message.preset_matched_first_person'));
    } else if (preset.geometryVersion && effective && !VersionUtil.compare(preset.geometryVersion, '==', effective)) {
        showNotification('preset', i18nFormat('display_sensei.message.preset_source_version', {
            preset: i18n(preset.label),
            version: preset.geometryVersion,
            selected: effective
        }));
    }
}

function applyBedrockPreset(preset, ids, label) {
    if (preset.inherit) {
        runSlotEdit(ids, label, () => ids.forEach(slotId => applyInherit(slotId, true)));
        return true;
    }
    let areas = resolvePresetAreas(preset);
    let covered = areas ? ids.filter(slotId => isPlainObject(areas[slotId])) : [];
    if (!covered.length) return false;
    runSlotEdit(covered, label, () => {
        for (let slotId of covered) {
            writePresetValues(slotId, areas[slotId]);
            if (slotId === 'gui' && typeof areas.gui.fit_to_frame === 'boolean') writeGuiFitToFrame(areas.gui.fit_to_frame);
        }
    });
    notePresetLimits(preset, covered);
    return true;
}

function isPresetUncalibrated(presetId) {
    let preset = findBedrockPreset(presetId);
    return !!preset && !preset.inherit && !resolvePresetAreas(preset);
}

function applySavedPreset(preset, ids, label) {
    let covered = ids.filter(slotId => isPlainObject(preset.areas[slotId]));
    if (!covered.length) return false;
    let turns = [];
    runSlotEdit(covered, label, () => {
        turns = covered.map(slotId => applySavedPresetArea(preset, slotId));
    });
    reportMirrorTurns(turns);
    return true;
}

function applyPreset(presetId, slotIds) {
    if (!isBlockRouteActive()) return false;
    let ids = normalizeSlotIds(slotIds);
    if (!ids.length) return false;
    let label = i18n('display_sensei.undo.apply_preset');
    let preset = findBedrockPreset(presetId === 'block' ? BEDROCK_DEFAULTS_PRESET_ID : presetId);
    if (preset) return applyBedrockPreset(preset, ids, label);
    let saved = findSavedPreset(presetId);
    return saved ? applySavedPreset(saved, ids, label) : false;
}

// =========================
// Blockbench's own Apply Preset menu (block route)
// =========================
let unmappedBlockbenchPresets = new Set();

const BEDROCK_MENU_PRESET_KEY = 'display_sensei_preset';

function showPresetNotApplied(bedrockId) {
    showMessage(bedrockId && isPresetUncalibrated(bedrockId) ? 'display_sensei.message.preset_not_calibrated' : 'display_sensei.message.preset_not_applicable');
}

function applyBlockbenchPreset(original, args) {
    let [preset, all] = args;
    if (!isBlockRouteActive() || !isPlainObject(preset)) return original.apply(this, args);
    let slotIds = all ? undefined : [DisplayMode.display_slot];
    if (typeof preset[BEDROCK_MENU_PRESET_KEY] === 'string') {
        let bedrockId = preset[BEDROCK_MENU_PRESET_KEY];
        if (!applyPreset(bedrockId, slotIds)) showPresetNotApplied(bedrockId);
        return;
    }
    if (!isPlainObject(preset.areas)) return original.apply(this, args);
    let applied;
    let bedrockId = null;
    if (preset.fixed) {
        bedrockId = BEDROCK_PRESET_FOR_BLOCKBENCH[preset.id];
        if (!bedrockId) {
            if (!unmappedBlockbenchPresets.has(preset.id)) {
                unmappedBlockbenchPresets.add(preset.id);
                console.warn(LOG_PREFIX, `Blockbench's preset "${preset.id}" has no Bedrock version; it is applied as it is.`);
            }
            return original.apply(this, args);
        }
        applied = applyPreset(bedrockId, slotIds);
    } else {
        let ids = normalizeSlotIds(slotIds);
        applied = ids.length > 0 && applySavedPreset(preset, ids, i18n('display_sensei.undo.apply_preset'));
    }
    if (!applied) showPresetNotApplied(bedrockId);
}

function wrapBlockbenchApplyPreset() {
    return wrapMethod(DisplayMode, 'applyPreset', applyBlockbenchPreset);
}

function getBedrockMenuLabel(preset) {
    let label = i18n(preset.label);
    return isPresetUncalibrated(preset.id) ? i18nFormat('display_sensei.preset.not_calibrated_label', { name: label }) : label;
}

const BEDROCK_MENU_ICONS = { bedrock: 'build', vanilla: 'category' };

function buildBedrockMenuEntries() {
    let mapped = Object.values(BEDROCK_PRESET_FOR_BLOCKBENCH);
    return BEDROCK_PRESETS.filter(preset => !mapped.includes(preset.id)).map(preset => {
        let request = { [BEDROCK_MENU_PRESET_KEY]: preset.id };
        return {
            icon: BEDROCK_MENU_ICONS[preset.group] || 'label',
            name: getBedrockMenuLabel(preset),
            click() {
                DisplayMode.applyPreset(request);
            },
            children: [
                { name: 'action.apply_display_preset.here', icon: 'done', click() { DisplayMode.applyPreset(request); } },
                { name: 'action.apply_display_preset.everywhere', icon: 'done_all', click() { DisplayMode.applyPreset(request, true); } }
            ]
        };
    });
}

function relabelBlockbenchPresetMenu(original, args) {
    let entries = original.apply(this, args);
    if (!isBlockRouteActive() || isReadingBlockbenchPresets || !Array.isArray(entries)) return entries;
    for (let entry of entries) {
        let preset = readPresetOfMenuEntry(entry);
        let bedrockPreset = preset && preset.fixed ? findBedrockPreset(BEDROCK_PRESET_FOR_BLOCKBENCH[preset.id]) : null;
        if (bedrockPreset) entry.name = getBedrockMenuLabel(bedrockPreset);
    }
    return entries.concat(buildBedrockMenuEntries());
}

function wrapBlockbenchPresetMenu() {
    let action = BarItems.apply_display_preset;
    if (!action || typeof action.children !== 'function') return { delete() {} };
    return wrapMethod(action, 'children', relabelBlockbenchPresetMenu);
}

// =========================
// GUI fit_to_frame
// =========================
function writeGuiFitToFrame(fitToFrame) {
    getProjectData().gui_fit_to_frame = fitToFrame;
    Project.display_settings.gui.fit_to_frame = fitToFrame;
}

function setGuiFitToFrame(value) {
    if (!isBlockRouteActive()) return false;
    let fitToFrame = !!value;
    runSlotEdit(['gui'], i18n('display_sensei.undo.fit_to_frame'), () => writeGuiFitToFrame(fitToFrame));
    return true;
}

// =========================
// Geometry version
// =========================
function getGeometryVersion() {
    if (!isBlockRouteActive()) return null;
    return getProjectData().geometry_version;
}

function setGeometryVersion(version) {
    if (!isBlockRouteActive() || !isSupportedGeometryVersion(version)) return false;
    runProjectDataEdit(i18n('display_sensei.undo.geometry_version'), () => {
        getProjectData().geometry_version = version;
    });
    return true;
}

function effectiveVersionFor(itemDisplayTransforms) {
    let selected = getProjectData().geometry_version;
    let floor = getGeometryVersionFloor(itemDisplayTransforms);
    return floor ? laterGeometryVersion(selected, floor) : selected;
}

function versionWithoutTransforms(blockbenchVersion) {
    let selected = getProjectData().geometry_version;
    return isGeometryVersionString(blockbenchVersion) ? earlierGeometryVersion(blockbenchVersion, selected) : selected;
}

function getEffectiveGeometryVersion() {
    if (!isBlockRouteActive()) return null;
    return effectiveVersionFor(buildItemDisplayTransforms());
}

function getGeometryVersionChoices() {
    if (!isBlockRouteActive()) return null;
    let choices = GEOMETRY_VERSIONS.map(entry => ({ version: entry.version, label: i18n(entry.label), hint: i18n(entry.hint) }));
    let selected = getProjectData().geometry_version;
    if (!choices.some(choice => choice.version === selected)) {
        choices.push({
            version: selected,
            label: i18nFormat('display_sensei.version.from_file', { version: selected }),
            hint: i18n('display_sensei.version.from_file_hint')
        });
        choices.sort((a, b) => VersionUtil.compare(a.version, b.version));
    }
    return choices;
}

function shelfCopiesItemFrame() {
    return isSlotInherited('on_shelf') === true &&
        VersionUtil.compare(getProjectData().geometry_version, '<', SHELF_GEOMETRY_VERSION);
}

// =========================
// Export
// =========================
function buildItemDisplayTransforms() {
    if (!isBlockRouteActive()) return null;
    let data = getProjectData();
    let transforms = {};
    for (let slot of BEDROCK_SLOTS) {
        if (isSlotInherited(slot.id)) continue;
        let values = readSlotValues(slot.id);
        let defaults = engineDefaultsFor(slot.id);
        let unset = data.unset_fields[slot.id] || [];
        let entry = {};
        for (let field of FALLBACK_FIELDS) {
            if (unset.includes(field) && sameChannelValues(field, values[field], defaults[field])) continue;
            entry[field] = sanitizeVector(field, values[field]);
        }
        if (!isZeroVector(values.rotation_pivot)) entry.rotation_pivot = sanitizeVector('rotation_pivot', values.rotation_pivot);
        if (!isZeroVector(values.scale_pivot)) entry.scale_pivot = sanitizeVector('scale_pivot', values.scale_pivot);
        if (slot.id === 'gui') entry.fit_to_frame = data.gui_fit_to_frame;
        transforms[slot.bedrockKey] = entry;
    }
    return Object.keys(transforms).length ? transforms : null;
}

// =========================
// Preview
// =========================
function refreshDisplayPreview(slotIds) {
    if (!isBlockRouteActive()) return;
    let shownSlotId = DisplayMode.display_slot;
    let shownSlotChanged = !slotIds || slotIds.includes(shownSlotId) || (shownSlotId === 'on_shelf' && slotIds.includes('fixed'));
    if (Modes.display && shownSlotChanged && Project.display_settings[shownSlotId]) {
        DisplayMode.updateDisplayBase();
    }
    if (DisplayMode.vue) DisplayMode.vue.$forceUpdate();
    refreshPanel();
}

// =========================
// Reading geometry files
// =========================
const geometryFileInfo = new WeakMap();

function rememberGeometryFile(data, args) {
    let geometries = data && data['minecraft:geometry'];
    if (!Array.isArray(geometries)) return;
    let info = {
        formatVersion: data.format_version,
        importing: args === true || !!(args && args.import_to_current_project)
    };
    for (let geometry of geometries) {
        if (isPlainObject(geometry)) geometryFileInfo.set(geometry, info);
    }
}

function wrapBedrockParse() {
    return wrapMethod(Codecs.bedrock, 'parse', function(original, args) {
        rememberGeometryFile(args[0], args[2]);
        return original.apply(this, args);
    });
}

function fileNumber(value, fallback) {
    return typeof value === 'number' && Number.isFinite(value) ? value : fallback;
}

function turnMirroredEntry(entry, slotId, flags, getSize) {
    let defaults = engineDefaultsFor(slotId);
    let values = {};
    for (let channel of SLOT_CHANNELS) {
        let fallback = defaults[channel];
        values[channel] = Array.isArray(entry[channel]) ? [0, 1, 2].map(axis => fileNumber(entry[channel][axis], fallback[axis])) : fallback.slice();
    }
    let result = computeMirrorTurn(slotId, values, flags, getSize);
    entry.rotation = result.rotation;
    if (!sameVector(result.translation, values.translation)) entry.translation = result.translation;
    return result.turn;
}

function prepareTransformsForBlockbench(transforms, geometry) {
    if ('shelf' in transforms) {
        transforms.on_shelf = transforms.shelf;
        delete transforms.shelf;
    }
    let clamped = false;
    let turns = [];
    let size = null;
    let getSize = () => size || (size = measureGeometrySize(geometry));
    for (let [slotId, entry] of Object.entries(transforms)) {
        if (!isPlainObject(entry)) continue;
        let mirror = Array.isArray(entry.scale) ? [0, 1, 2].map(axis => typeof entry.scale[axis] === 'number' && entry.scale[axis] < 0) : [false, false, false];
        for (let channel of SLOT_CHANNELS) {
            if (channel === 'rotation' || !Array.isArray(entry[channel])) continue;
            let values = entry[channel].map(value => (typeof value === 'number' ? sanitizeSlotValue(channel, value) : value));
            let read = channel === 'scale' ? entry[channel].map(value => (typeof value === 'number' ? Math.abs(value) : value)) : entry[channel];
            if (values.some((value, axis) => value !== read[axis])) clamped = true;
            entry[channel] = values;
        }
        if (mirror.some(Boolean) && findBedrockSlot(slotId)) turns.push(turnMirroredEntry(entry, slotId, mirror, getSize));
    }
    return { clamped, turns };
}

function readBlockGeometry(geometry, file) {
    let transforms = isPlainObject(geometry.item_display_transforms) ? geometry.item_display_transforms : {};
    let prepared = prepareTransformsForBlockbench(transforms, geometry);

    updateProjectData(data => {
        for (let slot of BEDROCK_SLOTS) {
            let entry = transforms[slot.id];
            if (isPlainObject(entry)) {
                data.inherit[slot.id] = false;
                data.unset_fields[slot.id] = FALLBACK_FIELDS.filter(field => !Array.isArray(entry[field]));
            } else if (!file.importing) {
                data.inherit[slot.id] = true;
                delete data.unset_fields[slot.id];
            }
        }
        let gui = transforms.gui;
        if (isPlainObject(gui)) {
            data.gui_fit_to_frame = typeof gui.fit_to_frame === 'boolean' ? gui.fit_to_frame : true;
        } else if (!file.importing) {
            data.gui_fit_to_frame = true;
        }
        if (!file.importing) {
            data.geometry_version = isSupportedGeometryVersion(file.formatVersion) ? file.formatVersion : DEFAULT_GEOMETRY_VERSION;
        }
    });
    if (prepared.clamped) showNotification('values_clamped', i18n('display_sensei.message.file_values_clamped'));
    reportMirrorTurns(prepared.turns, true);
}

function readEntityGeometry(geometry, file) {
    if (file.importing) return;
    let transforms = geometry.item_display_transforms;
    updateProjectData(data => {
        data.entity_display_transforms = isPlainObject(transforms) && Object.keys(transforms).length ? cloneJson(transforms) : null;
    });
}

function onBedrockGeometryParse(event) {
    let geometry = event && event.model;
    if (!isPlainObject(geometry) || !Project) return;
    let file = geometryFileInfo.get(geometry) || { formatVersion: null, importing: false };
    if (getRoute() === 'block') {
        readBlockGeometry(geometry, file);
    } else if (isEntityFormat()) {
        readEntityGeometry(geometry, file);
    }
}

function hasEntityDisplayTransforms() {
    return isEntityFormat() && !!Project && !!getProjectData().entity_display_transforms;
}

// =========================
// Writing geometry files
// =========================
let lastCompiledVersion = null;

function onBedrockCompile(event) {
    let model = event && event.model;
    let geometries = model && model['minecraft:geometry'];
    if (!Array.isArray(geometries) || !Project) return;
    let route = getRoute();
    if (route === 'none') return;
    let wizard = getWizardEntityCompileSource(event);
    if (wizard) {
        stripItemDisplayTransforms(geometries);
        if (wizard === 'item') noteItemWizardCompile();
        return;
    }
    if (route === 'block') {
        let transforms = buildItemDisplayTransforms();
        for (let geometry of geometries) {
            if (!isPlainObject(geometry)) continue;
            if (transforms) {
                geometry.item_display_transforms = cloneJson(transforms);
            } else {
                delete geometry.item_display_transforms;
            }
        }
        model.format_version = transforms ? effectiveVersionFor(transforms) : versionWithoutTransforms(model.format_version);
        lastCompiledVersion = model.format_version;
        if (isBlockWizardCompile(event)) noteBlockWizardCompile(transforms);
    } else if (isEntityFormat()) {
        let kept = getProjectData().entity_display_transforms;
        for (let geometry of geometries) {
            if (!isPlainObject(geometry)) continue;
            if (kept) {
                geometry.item_display_transforms = cloneJson(kept);
            } else {
                delete geometry.item_display_transforms;
            }
        }
    }
}

// =========================
// Saving over an existing file
// =========================
function chooseFileVersion(file, fileVersion) {
    if (!isPlainObject(file) || !Array.isArray(file['minecraft:geometry']) || !lastCompiledVersion) return;
    let ownVersion = lastCompiledVersion;
    if (!isGeometryVersionString(fileVersion)) {
        file.format_version = ownVersion;
        return;
    }
    if (file['minecraft:geometry'].length < 2) {
        file.format_version = laterGeometryVersion(fileVersion, ownVersion);
        return;
    }
    let transforms = buildItemDisplayTransforms();
    let needed = transforms ? getGeometryVersionFloor(transforms) : ownVersion;
    let version = laterGeometryVersion(fileVersion, needed);
    file.format_version = version;
    let crossed = GEOMETRY_MILESTONES.filter(milestone =>
        VersionUtil.compare(fileVersion, '<', milestone) && VersionUtil.compare(version, '>=', milestone));
    if (crossed.length) {
        showNotification('file_version', i18nFormat('display_sensei.message.file_version_raised', { from: fileVersion, version }));
    } else if (VersionUtil.compare(ownVersion, '>', version)) {
        showNotification('file_version', i18nFormat('display_sensei.message.file_version_kept', { version, chosen: ownVersion }));
    }
}

function wrapBedrockOverwrite() {
    return wrapMethod(Codecs.bedrock, 'overwrite', function(original, args) {
        return runInsideBedrockOverwrite(() => {
            if (getRoute() !== 'block') return original.apply(this, args);
            let readJson = window.autoParseJSON;
            let writeJson = window.autoStringify;
            let fileVersion = null;
            let readFile = function(...parseArgs) {
                let data = readJson.apply(this, parseArgs);
                if (fileVersion === null && isPlainObject(data)) fileVersion = data.format_version;
                return data;
            };
            let writeFile = function(object) {
                chooseFileVersion(object, fileVersion);
                return writeJson.apply(this, arguments);
            };
            lastCompiledVersion = null;
            return withTemporaryValue(window, 'autoParseJSON', readFile, () =>
                withTemporaryValue(window, 'autoStringify', writeFile, () => original.apply(this, args)));
        });
    });
}

// =========================
// .bbmodel files
// =========================
function onProjectCompile(event) {
    let model = event && event.model;
    if (!isBlockRouteActive() || !model || !isPlainObject(model.display)) return;
    for (let slot of BEDROCK_SLOTS) {
        if (slot.id in model.display && isSlotInherited(slot.id)) delete model.display[slot.id];
    }
    if (!Object.keys(model.display).length) delete model.display;
}

let mergeStarting = false;
let mergeSave = null;

function onProjectMerge() {
    mergeStarting = isBlockRouteActive();
}

function onInitEdit(event) {
    if (!mergeStarting) return;
    mergeStarting = false;
    mergeSave = event && event.save;
}

function onProjectFileParsed() {
    mergeStarting = false;
    mergeSave = null;
    if (!isBlockRouteActive()) return;
    let gui = Project.display_settings.gui;
    if (gui) gui.fit_to_frame = getProjectData().gui_fit_to_frame;
}

// =========================
// Following Blockbench's own edits
// =========================
function sanitizeSlot(slot) {
    let clamped = false;
    for (let channel of SLOT_CHANNELS) {
        let values = slot[channel].map(value => sanitizeSlotValue(channel, value));
        if (values.every((value, axis) => value === slot[channel][axis])) continue;
        slot[channel].replace(values);
        if (channel !== 'rotation') clamped = true;
    }
    return clamped;
}

function followEditedSlot(slotId, save) {
    let before = save.display_slots ? save.display_slots[slotId] : undefined;
    if (before === undefined) return;
    let data = getProjectData();
    let dataBefore = save[PROJECT_DATA_KEY];
    if (dataBefore && dataBefore.inherit && dataBefore.inherit[slotId] !== data.inherit[slotId]) return;
    let reference = before || new DisplaySlot(slotId).copy();
    let slot = Project.display_settings[slotId];
    let changed = SLOT_CHANNELS.filter(channel => !sameChannelValues(channel, reference[channel], slot[channel]));
    if (!changed.length) return;
    data.inherit[slotId] = false;
    forgetUnsetFields(data, slotId, changed);
}

function syncGuiFitToFrame(save, followChange) {
    let gui = Project.display_settings.gui;
    let before = save.display_slots && save.display_slots.gui;
    if (!gui || !before || before.fit_to_frame === gui.fit_to_frame) return;
    let onlyFitChanged = SLOT_CHANNELS.every(channel => sameChannelValues(channel, before[channel], gui[channel]));
    if (followChange && onlyFitChanged) {
        getProjectData().gui_fit_to_frame = gui.fit_to_frame;
    } else {
        gui.fit_to_frame = getProjectData().gui_fit_to_frame;
    }
}

function onFinishEdit(event) {
    let slotIds = event && event.aspects && event.aspects.display_slots;
    let save = Undo.current_save;
    if (isFinishingOwnEdit || !isBlockRouteActive() || !Array.isArray(slotIds) || !save) return;
    let merging = save === mergeSave;
    if (merging) mergeSave = null;
    let turns = [];
    let clamped = false;
    for (let slotId of slotIds) {
        let slot = Project.display_settings[slotId];
        if (!slot || !findBedrockSlot(slotId)) continue;
        let turn = convertMirrorToTurn(slot);
        if (turn) turns.push(turn);
        if (sanitizeSlot(slot)) clamped = true;
        if (!merging) followEditedSlot(slotId, save);
    }
    if (slotIds.includes('gui')) syncGuiFitToFrame(save, !merging);
    if (turns.length || clamped) refreshDisplayPreview(slotIds);
    reportMirrorTurns(turns, clamped);
    if (clamped) showMessage('display_sensei.message.values_clamped');
}

function reseedInheritedSlotsAfterUndo(event) {
    let save = event && event.save;
    if (!isBlockRouteActive() || !save || !(save.display_slots || save[PROJECT_DATA_KEY])) return;
    restoreProjectDataFromUndo(save);
    Object.keys(save.display_slots || {}).forEach(ensureSlot);
    refreshDisplayPreview();
}

function onConvertFormat() {
    if (!isBlockRouteActive()) return;
    let turns = BEDROCK_SLOTS.map(slot => convertMirrorToTurn(Project.display_settings[slot.id])).filter(Boolean);
    if (!turns.length) return;
    refreshDisplayPreview();
    reportMirrorTurns(turns, true);
}

// =========================
// Install
// =========================
function resetSeededSlots() {
    for (let project of ModelProject.all) {
        if (!project.format || project.format.id !== BLOCK_FORMAT_ID) continue;
        let data = getProjectData(project);
        for (let slot of BEDROCK_SLOTS) {
            let displaySlot = project.display_settings[slot.id];
            if (displaySlot && seededSlots.has(displaySlot) && data.inherit[slot.id] && matchesEngineDefaults(displaySlot)) {
                displaySlot.default();
                displaySlot.update();
            }
        }
    }
}

function installBlockRoute() {
    let hooks = createDeletables([
        wrapBedrockParse,
        wrapBedrockOverwrite,
        () => Codecs.bedrock.on('parse', guardListener('bedrock parse', onBedrockGeometryParse)),
        () => Codecs.bedrock.on('compile', guardListener('bedrock compile', onBedrockCompile)),
        () => Codecs.project.on('compile', guardListener('project compile', onProjectCompile)),
        () => Codecs.project.on('merge', guardListener('project merge', onProjectMerge)),
        () => Codecs.project.on('parsed', guardListener('project parsed', onProjectFileParsed)),
        () => Blockbench.on('init_edit', guardListener('init_edit', onInitEdit)),
        () => Blockbench.on('finish_edit', guardListener('finish_edit', onFinishEdit)),
        () => Blockbench.on('load_undo_save', guardListener('load_undo_save', reseedInheritedSlotsAfterUndo)),
        () => Blockbench.on('convert_format', guardListener('convert_format', onConvertFormat)),
        wrapBlockbenchApplyPreset,
        wrapBlockbenchPresetMenu
    ]);
    return {
        delete() {
            hooks.delete();
            openSlotEdit = null;
            savedPresets = {};
            savedPresetIds = new WeakMap();
            savedPresetCount = 0;
            unmappedBlockbenchPresets = new Set();
            isReadingBlockbenchPresets = false;
            lastCompiledVersion = null;
            mergeStarting = false;
            mergeSave = null;
            resetSeededSlots();
            seededSlots = new WeakSet();
        }
    };
}

registerModuleInstaller('block_route', installBlockRoute);

// ---- src/views.js ----

// =========================
// Views: Display Mode per context (block route)
// =========================

// =========================
// Contexts
// =========================
const SLOT_LOADERS = {
    firstperson_righthand: 'loadFirstRight',
    firstperson_lefthand: 'loadFirstLeft',
    thirdperson_righthand: 'loadThirdRight',
    thirdperson_lefthand: 'loadThirdLeft',
    fixed: 'loadFixed',
    ground: 'loadGround',
    on_shelf: 'loadShelf',
    embedded: 'loadEmbedded',
    gui: 'loadGUI',
    head: 'loadHead'
};

const SUBTAB_CAMERAS = {
    third_back: 'back',
    third_front: 'front'
};

function findContextView(subtabId, handId) {
    let slot = findSlotForContext(subtabId, handId);
    if (!slot) return null;
    return {
        subtabId,
        handId: slot.hand || null,
        slotId: slot.id,
        loader: SLOT_LOADERS[slot.id],
        camera: SUBTAB_CAMERAS[subtabId] || null
    };
}

function hasThirdPersonViews(slotId) {
    let slot = findBedrockSlot(slotId);
    return !!slot && slot.subtabs.some(subtabId => SUBTAB_CAMERAS[subtabId]);
}

function getSlotHand(slotId) {
    let slot = findBedrockSlot(slotId);
    return slot && slot.hand ? slot.hand : null;
}

// =========================
// Third-person cameras
// =========================
const THIRD_PERSON_CAMERAS = {
    back: { position: [33, 45, 46], target: [4, 16, -3], fov: 45 },
    back_straight: { position: [0, 38, 56], target: [0, 17, 0], fov: 45 },
    front: { position: [16, 33, -55], target: [3, 17, -2], fov: 45 }
};

const TUNED_ITEM_POSITION = [6, 13.5266, -5.6746];

function getTunedItemPosition(reference = displayReferenceObjects.active) {
    return (reference && getTunedHoldPosition(reference)) ||
        getTunedHoldPosition(getBedrockReference('bedrock_player')) ||
        TUNED_ITEM_POSITION;
}

const BACK_CAMERA_STYLES = ['shoulder', 'straight'];
let backCameraStyle = 'shoulder';

function setBackCameraStyle(style) {
    if (BACK_CAMERA_STYLES.includes(style)) {
        backCameraStyle = style;
    }
}

const DISPLAY_PREVIEW_ID = 'display';

function getDisplayPreview() {
    return Preview.all.find(preview => preview.id === DISPLAY_PREVIEW_ID) || null;
}

function getHeldItemPosition(handId) {
    let area = DisplayMode.display_area;
    if (area && typeof area.getWorldPosition === 'function') {
        return area.getWorldPosition(new THREE.Vector3()).toArray();
    }
    let side = handId === 'left' ? -1 : 1;
    return [TUNED_ITEM_POSITION[0] * side, TUNED_ITEM_POSITION[1], TUNED_ITEM_POSITION[2]];
}

function offsetFromItem(point, side, tuned) {
    return [(point[0] - tuned[0]) * side, point[1] - tuned[1], point[2] - tuned[2]];
}

function computeThirdPersonCamera(view, handId, itemPosition, reference) {
    let cameraId = (view === 'back' && backCameraStyle === 'straight') ? 'back_straight' : view;
    let camera = THIRD_PERSON_CAMERAS[cameraId];
    if (!camera) return null;
    let side = handId === 'left' ? -1 : 1;
    let tuned = getTunedItemPosition(reference);
    let place = point => offsetFromItem(point, side, tuned).map((offset, axis) => itemPosition[axis] + offset);
    return { position: place(camera.position), target: place(camera.target), fov: camera.fov };
}

function applyThirdPersonCamera(view, handId) {
    let preview = getDisplayPreview();
    let camera = computeThirdPersonCamera(view, handId, getHeldItemPosition(handId));
    if (!preview || !camera) return;
    preview.loadAnglePreset({
        projection: 'perspective',
        position: camera.position,
        target: camera.target,
        fov: camera.fov
    });
}

// =========================
// Cameras of the other hand views (used by hand_views.js)
// =========================
const FIRST_PERSON_CAMERA = { position: [0, 24, 32.4], target: [0, 24, 0] };

const HAND_VIEW_MIN_RADIUS = 6;
const HAND_VIEW_MARGIN = 1.25;

function getFirstPersonFocalLength(aspect) {
    if (aspect > 1.7) return 18 / aspect;
    if (aspect > 1.0) return 16.57 - 3.57 * aspect;
    return 13 * aspect;
}

function getHeldItemSphere(handId) {
    let box = new THREE.Box3().expandByPoint(new THREE.Vector3().fromArray(getHeldItemPosition(handId)));
    if (Project && Project.model_3d) {
        Project.model_3d.updateMatrixWorld(true);
        let itemBox = new THREE.Box3().setFromObject(Project.model_3d);
        if (!itemBox.isEmpty()) box.union(itemBox);
    }
    return box.getBoundingSphere(new THREE.Sphere());
}

function frameHeldItem(camera, handId) {
    let sphere = getHeldItemSphere(handId);
    let radius = Math.max(sphere.radius, HAND_VIEW_MIN_RADIUS) * HAND_VIEW_MARGIN;
    let direction = new THREE.Vector3().fromArray(camera.position).sub(new THREE.Vector3().fromArray(camera.target)).normalize();
    let distance = radius / Math.sin(camera.fov * Math.PI / 360);
    return {
        position: sphere.center.clone().addScaledVector(direction, distance).toArray(),
        target: sphere.center.toArray(),
        fov: camera.fov
    };
}

function getHandViewCamera(view, aspect, reference) {
    if (!view.camera) {
        return { position: FIRST_PERSON_CAMERA.position.slice(), target: FIRST_PERSON_CAMERA.target.slice(), focalLength: getFirstPersonFocalLength(aspect) };
    }
    let camera = computeThirdPersonCamera(view.camera, view.handId, getHeldItemPosition(view.handId), reference);
    return camera ? frameHeldItem(camera, view.handId) : null;
}

let thirdPersonView = null;

function aimThirdPersonCamera() {
    let slotId = DisplayMode.display_slot;
    if (getRoute() !== 'block' || !Modes.display || !thirdPersonView || !hasThirdPersonViews(slotId)) return;
    applyThirdPersonCamera(thirdPersonView, getSlotHand(slotId));
}

function getThirdPersonView() {
    if (thirdPersonView) return thirdPersonView;
    let preview = getDisplayPreview();
    if (preview && preview.camera.position.z > preview.controls.target.z) {
        return 'back';
    }
    return 'front';
}

// =========================
// Showing a context
// =========================
let isShowingContext = false;

function showContext(subtabId, handId) {
    if (getRoute() !== 'block') return null;
    let view = findContextView(subtabId, handId);
    if (!view) return null;

    isShowingContext = true;
    try {
        let modeChanged = enterDisplayMode();
        DisplayMode[view.loader]();
        markBlockbenchSlotButton(view.slotId);
        if (view.camera) {
            thirdPersonView = view.camera;
            applyThirdPersonCamera(view.camera, view.handId);
        }
        if (modeChanged) {
            keepPanelVisibleInDisplayMode();
        }
    } catch (error) {
        console.error(LOG_PREFIX, 'Could not show the view:', error);
        showMessage('display_sensei.message.view_failed');
        return null;
    } finally {
        isShowingContext = false;
    }
    onActiveContextChanged();
    return view.slotId;
}

const GUI_CAMERA_ZOOM = 0.5;

function resetContextView(subtabId, handId) {
    let view = findContextView(subtabId, handId);
    if (getRoute() !== 'block' || !view) return null;
    resetPoseAngle(view.slotId);
    let slotId = showContext(subtabId, handId);
    let preview = getDisplayPreview();
    if (slotId && preview && preview.isOrtho && preview.camera.zoom !== GUI_CAMERA_ZOOM) {
        preview.camera.zoom = GUI_CAMERA_ZOOM;
        preview.camera.updateProjectionMatrix();
    }
    return slotId;
}

function ensureContextShown(subtabId, handId) {
    let view = findContextView(subtabId, handId);
    if (view && isShowingSlot(view.slotId)) return view.slotId;
    return showContext(subtabId, handId);
}

function enterDisplayMode() {
    if (Modes.display) return false;
    Modes.options.display.select();
    return true;
}

function markBlockbenchSlotButton(slotId) {
    document.querySelectorAll('#display_bar input[name="display"]').forEach(input => {
        input.checked = input.id === slotId;
    });
}

function keepPanelVisibleInDisplayMode() {
    if (getPanel()) {
        focusPanel();
    }
}

// =========================
// Following Display Mode
// =========================
function getActiveContext() {
    if (getRoute() !== 'block' || !Modes.display) return null;
    let slot = findBedrockSlot(DisplayMode.display_slot);
    if (!slot) return null;
    let camera = hasThirdPersonViews(slot.id) ? getThirdPersonView() : null;
    let subtabId = slot.subtabs.find(id => (SUBTAB_CAMERAS[id] || null) === camera);
    let tab = MAIN_TABS.find(entry => entry.subtabs.some(subtab => subtab.id === subtabId));
    if (!subtabId || !tab) return null;
    return {
        tabId: tab.id,
        subtabId,
        handId: slot.hand || null,
        slotId: slot.id
    };
}

function isShowingSlot(slotId) {
    return getRoute() === 'block' && !!Project && !!Modes.display && DisplayMode.display_slot === slotId &&
        !!Project.display_settings[slotId] && DisplayMode.slot === Project.display_settings[slotId];
}

function onActiveContextChanged() {
    refreshPanelSafely();
}

let isReloadingSlot = false;

function afterSlotLoader() {
    if (isShowingContext || isReloadingSlot || getRoute() !== 'block') return;
    if (hasThirdPersonViews(DisplayMode.display_slot)) {
        thirdPersonView = null;
    }
    onActiveContextChanged();
}

function afterDisplayModeLoad() {
    if (isShowingContext || getRoute() !== 'block') return;
    let slotId = DisplayMode.display_slot;
    if (thirdPersonView && hasThirdPersonViews(slotId)) {
        applyThirdPersonCamera(thirdPersonView, getSlotHand(slotId));
    }
    onActiveContextChanged();
}

// =========================
// The shelf preview
// =========================
function getShelfStandIn(slot) {
    if (slot || DisplayMode.display_slot !== 'on_shelf' || !shelfCopiesItemFrame()) return null;
    return ensureSlot('fixed');
}

function getDrawnDisplaySlot(slot) {
    if (slot) return slot;
    if (getRoute() !== 'block' || !Project) return null;
    return getShelfStandIn(slot) || Project.display_settings[DisplayMode.display_slot] || null;
}

function updateShelfDisplayBase(original, args) {
    let project = Project;
    if (getRoute() !== 'block' || DisplayMode.display_slot !== 'on_shelf') {
        return original.apply(DisplayMode, args);
    }
    let drawArgs = args;
    let standIn = getShelfStandIn(args[0]);
    if (standIn) {
        drawArgs = [standIn];
    }
    if (project.shelf_align_bottom) {
        return original.apply(DisplayMode, drawArgs);
    }
    return withTemporaryValue(project, 'shelf_align_bottom', true, () => original.apply(DisplayMode, drawArgs));
}

// =========================
// Wrapping DisplayMode functions
// =========================
function wrapSlotLoader(slotId) {
    return wrapMethod(DisplayMode, SLOT_LOADERS[slotId], (original, args) => {
        ensureSlot(slotId);
        let result = original.apply(DisplayMode, args);
        afterSlotLoader();
        return result;
    });
}

function wrapDisplayModeLoad() {
    return wrapMethod(DisplayMode, 'load', (original, args) => {
        isReloadingSlot = true;
        let result;
        try {
            result = original.apply(DisplayMode, args);
        } finally {
            isReloadingSlot = false;
        }
        afterDisplayModeLoad();
        return result;
    });
}

function refreshShownSlot() {
    if (!Modes.display || getRoute() !== 'block') return;
    if (ensureSlot(DisplayMode.display_slot)) DisplayMode.updateDisplayBase();
}

// =========================
// Install
// =========================
function installViews() {
    let wrappers = createDeletables(
        Object.keys(SLOT_LOADERS).map(slotId => () => wrapSlotLoader(slotId)).concat([
            wrapDisplayModeLoad,
            () => wrapMethod(DisplayMode, 'updateDisplayBase', updateShelfDisplayBase)
        ])
    );
    refreshShownSlot();

    return {
        delete() {
            wrappers.delete();
            thirdPersonView = null;
            if (Modes.display && getRoute() === 'block' && DisplayMode.display_slot === 'on_shelf') {
                DisplayMode.updateDisplayBase();
            }
        }
    };
}

registerModuleInstaller('views', installViews);

// ---- src/native_display_panel.js ----

// =========================
// Blockbench's Display panel (block route)
// =========================
const NATIVE_DISPLAY_PANEL_ID = 'display';

// =========================
// Hiding the panel
// =========================
let isHidingInstalled = false;

function isSidebarOpen(slot) {
    if (Blockbench.isMobile) return true;
    if (slot === 'left_bar') return !!Prop.show_left_bar;
    if (slot === 'right_bar') return !!Prop.show_right_bar;
    return true;
}

function isOwnPanelShown() {
    let panel = getPanel();
    if (!panel || panel.slot === 'hidden') return false;
    let container = panel;
    if (panel.attached_to) {
        if (panel.attached_to === NATIVE_DISPLAY_PANEL_ID) return false;
        container = panel.getHostPanel();
        if (!container || container.slot === 'hidden' || !Condition(container.condition)) return false;
    }
    return isSidebarOpen(container.slot);
}

function isNativeDisplayPanelHidden() {
    return isHidingInstalled && !!Modes.display && getRoute() === 'block' && isOwnPanelShown();
}

function syncNativeDisplayPanel() {
    if (Modes.display) updateInterface();
}

function hideNativeDisplayPanel() {
    let panel = Panels[NATIVE_DISPLAY_PANEL_ID];
    if (!panel) return { delete() {} };
    let original = panel.condition;
    let condition = Object.assign({}, isPlainObject(original) ? original : {}, {
        method: context => Condition(original, context) && !isNativeDisplayPanelHidden()
    });
    panel.condition = condition;
    isHidingInstalled = true;
    return {
        delete() {
            isHidingInstalled = false;
            if (panel.condition === condition) {
                panel.condition = original;
            }
            syncNativeDisplayPanel();
        }
    };
}

// =========================
// First-person framing
// =========================
const FIRST_PERSON_SLOTS = ['firstperson_righthand', 'firstperson_lefthand'];

let hiddenAtLastResize = null;

function readHiddenForResize() {
    return Modes.display ? isNativeDisplayPanelHidden() : null;
}

function reframeFirstPersonAfterResize() {
    let hidden = readHiddenForResize();
    let changed = hidden !== null && hiddenAtLastResize !== null && hidden !== hiddenAtLastResize;
    hiddenAtLastResize = hidden;
    let slotId = DisplayMode.display_slot;
    if (changed && FIRST_PERSON_SLOTS.includes(slotId) && isShowingSlot(slotId)) {
        DisplayMode.load(slotId);
    }
}

function followResizes() {
    hiddenAtLastResize = readHiddenForResize();
    return Blockbench.on('resize_window', guardListener('resize_window', reframeFirstPersonAfterResize));
}

// =========================
// Reference models
// =========================
let referenceIdsBySlot = {};

function wrapReferenceBar() {
    return wrapMethod(displayReferenceObjects, 'bar', function(original, args) {
        if (Array.isArray(args[0])) {
            referenceIdsBySlot[DisplayMode.display_slot] = args[0].slice();
        }
        return original.apply(this, args);
    });
}

function rememberDrawnReferenceBar() {
    let bar = document.getElementById('display_ref_bar');
    let active = displayReferenceObjects.active;
    if (!Modes.display || !bar || !active) return;
    let ids = Array.from(bar.querySelectorAll('input[name="refmodel"]'), input => input.id);
    if (ids.includes(active.id)) {
        referenceIdsBySlot[DisplayMode.display_slot] = ids;
    }
}

function getOfferedReferenceIds(slotId) {
    let ids = referenceIdsBySlot[slotId];
    if (!isShowingSlot(slotId) || !ids) return null;
    let refmodels = displayReferenceObjects.refmodels;
    return ids.filter(id => refmodels[id] && Condition(refmodels[id]));
}

function getReferenceChoices(slotId) {
    let ids = getOfferedReferenceIds(slotId);
    if (!ids) return null;
    return ids.map(id => {
        let reference = displayReferenceObjects.refmodels[id];
        let { note, approximate } = describeReference(reference, slotId);
        return {
            id,
            name: reference.name,
            icon: reference.icon,
            active: displayReferenceObjects.active === reference,
            note,
            approximate
        };
    });
}

function setReferenceModel(slotId, referenceId) {
    let ids = getOfferedReferenceIds(slotId);
    let index = ids ? ids.indexOf(referenceId) : -1;
    if (index === -1) return false;
    displayReferenceObjects.refmodels[referenceId].load(index);
    markBlockbenchReferenceButton(referenceId);
    aimThirdPersonCamera();
    return true;
}

function markBlockbenchReferenceButton(referenceId) {
    document.querySelectorAll('#display_ref_bar input[name="refmodel"]').forEach(input => {
        input.checked = input.id === referenceId;
    });
}

// =========================
// Pose angle (preview only)
// =========================
function getPoseReference(slotId) {
    if (!isShowingSlot(slotId)) return null;
    let reference = displayReferenceObjects.active;
    if (!reference || typeof reference.updateBasePosition !== 'function' || !getPoseSpec(reference, slotId)) return null;
    return reference;
}

function getPoseAngle(slotId) {
    let reference = getPoseReference(slotId);
    if (!reference) return null;
    let spec = getPoseSpec(reference, slotId);
    let stored = reference.pose_angles[slotId];
    let value = clampToRange(Number.isFinite(stored) ? stored : spec.start, [spec.min, spec.max]);
    return { value, min: spec.min, max: spec.max };
}

function setPoseAngle(slotId, degrees) {
    let reference = getPoseReference(slotId);
    let angle = Number(degrees);
    if (!reference || !Number.isFinite(angle)) return false;
    let spec = getPoseSpec(reference, slotId);
    angle = clampToRange(angle, [spec.min, spec.max]);
    reference.pose_angles[slotId] = angle;
    reference.updateBasePosition();
    if (DisplayMode.vue) DisplayMode.vue.pose_angle = angle;
    return true;
}

function resetPoseAngle(slotId) {
    if (getRoute() !== 'block') return false;
    let reset = false;
    for (let reference of getPosableReferences()) {
        let start = reference.ds_definition.posable[slotId];
        if (!start) continue;
        reference.pose_angles[slotId] = start.start;
        reset = true;
    }
    return reset;
}

// =========================
// Ground preview animation
// =========================
function getPreviewAnimation(slotId) {
    if (slotId !== 'ground' || !isShowingSlot(slotId)) return null;
    return DisplayMode.animate_preview !== false;
}

function setPreviewAnimation(slotId, on) {
    if (getPreviewAnimation(slotId) === null) return false;
    DisplayMode.animate_preview = !!on;
    if (DisplayMode.vue) DisplayMode.vue.animate_preview = !!on;
    return true;
}

// =========================
// Copy, paste and New Preset
// =========================
function hasCopiedSlot() {
    return isPlainObject(Clipbench.display_slot);
}

function copyShownSlot(slotId) {
    if (!isShowingSlot(slotId)) return false;
    DisplayMode.copy();
    return true;
}

function pasteIntoShownSlot(slotId) {
    if (!isShowingSlot(slotId) || !hasCopiedSlot()) return false;
    DisplayMode.paste();
    return true;
}

function openSavePresetDialog() {
    let action = BarItems.add_display_preset;
    if (getRoute() !== 'block' || !Modes.display || !action) return false;
    for (let slot of BEDROCK_SLOTS) {
        if (Project.display_settings[slot.id]) ensureSlot(slot.id);
    }
    return action.trigger() !== false;
}

// =========================
// Reset buttons (Blockbench's Display panel)
// =========================
function followResetButtons() {
    let vue = DisplayMode.vue;
    if (!vue || typeof vue.resetChannel !== 'function') return { delete() {} };
    return wrapMethod(vue, 'resetChannel', function(original, args) {
        let slotId = DisplayMode.display_slot;
        if (getRoute() !== 'block' || !isShowingSlot(slotId)) return original.apply(this, args);
        resetSlotChannel(slotId, args[0]);
    });
}

// =========================
// Install
// =========================
function installNativeDisplayPanel() {
    let hooks = createDeletables([
        wrapReferenceBar,
        hideNativeDisplayPanel,
        followResizes,
        followResetButtons
    ]);
    rememberDrawnReferenceBar();
    return {
        delete() {
            hooks.delete();
            referenceIdsBySlot = {};
            hiddenAtLastResize = null;
        }
    };
}

registerModuleInstaller('native_display_panel', installNativeDisplayPanel);

// ---- src/bedrock_references.js ----

// =========================
// Bedrock reference models (block route)
// =========================

// =========================
// Bedrock values in Blockbench's space
// =========================
const DEGREES = Math.PI / 180;

function toBlockbenchPosition(position) {
    return [-position[0], position[1], position[2]];
}

function toBlockbenchRotation(rotation) {
    return [-rotation[0], -rotation[1], rotation[2]];
}

const HOLD_OFFSET = [0, -3, -3];
const HOLD_TURN_X = -90;

const LEFT_HAND_PIVOT_MIRROR = false;

const PLAYER_ENTITY_SCALE = 0.9375;

const HEAD_CENTRE_OFFSET = 4;
const HEAD_BASE_SCALE = 0.625;

const THIRD_PERSON_SLOTS = ['thirdperson_righthand', 'thirdperson_lefthand'];
const HOLDER_SLOTS = ['thirdperson_righthand', 'thirdperson_lefthand', 'head'];

// =========================
// Vanilla numbers: third person and head
// =========================
const THIRD_PERSON_RIGS = {
    player_wide: {
        right: { shoulder: [-5, 22, 0], itemBone: [-6, 15, 1] },
        left: { shoulder: [5, 22, 0], itemBone: [6, 15, 1] }
    },
    player_slim: {
        right: { shoulder: [-5, 21.5, 0], itemBone: [-6, 14.5, 1] },
        left: { shoulder: [5, 21.5, 0], itemBone: [6, 14.5, 1] }
    },
    zombie: {
        right: { shoulder: [-5, 22, 0], itemBone: [-6, 15, 1] },
        left: { shoulder: [5, 22, 0], itemBone: [6, 15, 1] }
    },
    baby_zombie: {
        right: { shoulder: [-3, 8.5, 0], itemBone: [-3, 6.5, 0] },
        left: { shoulder: [3, 8.5, 0], itemBone: [3, 6.5, 0] }
    },
    armor_stand: {
        right: { shoulder: [-5, 22, 0], itemBone: [-6, 15, 1] },
        left: { shoulder: [5, 22, 0], itemBone: [6, 15, 1] }
    }
};

const HEAD_RIGS = {
    player: { headPivot: [0, 24, 0] },
    zombie: { headPivot: [0, 24, 0] },
    baby_zombie: { headPivot: [0, 8.75, 0], centreOffset: 3.25, baseScale: HEAD_BASE_SCALE * 0.75 },
    armor_stand: { headPivot: [0, 24, 0] }
};

const PLAYER_HOLD_ANGLE = 18;

const HEAD_PITCH_RANGE = [-90, 90];
const ARM_ANGLE_RANGE = [-180, 180];

const SNEAK_PARENTS = [
    { pivot: [0, 0, 0], pos: [0, 1.25, 9], rot: [28, 0, 0] },
    { pivot: [0, 24, 0], pos: [0, -2, 0] }
];
const SNEAK_LEG_TURN = -28;
const SNEAK_HEAD_DROP = -1;
const SNEAK_OTHER_ARM = -5.7;

const ARM_POSES = [
    { id: 'holding', labelKey: 'display_sensei.arm_pose.holding', arm: null, leftHand: true },
    { id: 'sneaking', labelKey: 'display_sensei.arm_pose.sneaking', arm: [-23.7, 0, 0], parents: SNEAK_PARENTS, leftHand: true },
    { id: 'eating', labelKey: 'display_sensei.arm_pose.eating', arm: [-78, -22.5, -5.625] },
    { id: 'eating_bite', labelKey: 'display_sensei.arm_pose.eating_bite', arm: [-66.75, -11.25, 5.625] },
    { id: 'brushing', labelKey: 'display_sensei.arm_pose.brushing', arm: [-68, 0, 5] },
    { id: 'spyglass', labelKey: 'display_sensei.arm_pose.spyglass', arm: [-123, -15, 5] },
    { id: 'goat_horn', labelKey: 'display_sensei.arm_pose.goat_horn', arm: [-93, -30, 5], itemAnim: { pos: [4, 0, 1], rot: [15, 0, 100] } },
    { id: 'spear_raise', labelKey: 'display_sensei.arm_pose.spear_raise', arm: [-152.5, 0, 0] },
    { id: 'bow_aim', labelKey: 'display_sensei.arm_pose.bow_aim', arm: [-90, -5, 0], itemAnim: { rot: [0, -10, 0] } },
    { id: 'crossbow_load', labelKey: 'display_sensei.arm_pose.crossbow_load', arm: [-60, -45, -2.5] },
    { id: 'crossbow_hold', labelKey: 'display_sensei.arm_pose.crossbow_hold', arm: [-93, 0, 0] },
    { id: 'shield_block', labelKey: 'display_sensei.arm_pose.shield_block', arm: [-38, -30, -25], itemAnim: { pos: [-1, -3, 0], rot: [0, -60, -45] } }
];

const ZOMBIE_ARMS = { right: [-90, -5.73, 0], left: [-90, 5.73, 0] };
const BABY_ZOMBIE_ARMS = { right: [0, -5.73, 0], left: [0, 5.73, 0] };
const ZOMBIE_HOLDING_LEFT_ARMS = { right: [0, 0, 0], left: [-18, 0, 0] };

function getZombieArms(kind, slotId) {
    if (slotId === 'thirdperson_lefthand') return ZOMBIE_HOLDING_LEFT_ARMS;
    if (kind === 'baby_zombie' && slotId === 'thirdperson_righthand') return BABY_ZOMBIE_ARMS;
    return ZOMBIE_ARMS;
}

const STAND_POSES = [
    { id: 'default', labelKey: 'display_sensei.stand_pose.default', line: 108, body: [0, 0, 0], head: [0, 0, 0], rightarm: [-15, 0, 10], leftarm: [-10, 0, -10], rightleg: [1, 0, 1], leftleg: [-1, 0, -1] },
    { id: 'none', labelKey: 'display_sensei.stand_pose.none', line: 212, body: [0, 0, 0], head: [0, 0, 0], rightarm: [0, 0.01, 0.01], leftarm: [0, 0, 0], rightleg: [0, 0, 0], leftleg: [0, -0.1, -0.01] },
    { id: 'solemn', labelKey: 'display_sensei.stand_pose.solemn', line: 290, body: [0, 0, 2], head: [15, 0, 0], rightarm: [-60, -20, -10], leftarm: [-30, 15, 15], rightleg: [1, 0, 1], leftleg: [-1, 0, -1] },
    { id: 'athena', labelKey: 'display_sensei.stand_pose.athena', line: 4, body: [0, 0, 2], head: [-5, 0, 0], rightarm: [-60, 20, -10], leftarm: [10, 0, -5], rightleg: [3, 3, 3], leftleg: [-3, -3, -3] },
    { id: 'brandish', labelKey: 'display_sensei.stand_pose.brandish', line: 30, body: [0, 0, -2], head: [-15, 0, 0], rightarm: [-110, 50, 0], leftarm: [20, 0, -10], rightleg: [-5, 3, 3], leftleg: [5, -3, -3] },
    { id: 'honor', labelKey: 'display_sensei.stand_pose.honor', line: 186, body: [0, 0, 0], head: [-15, 0, 0], rightarm: [-110, -35, 0], leftarm: [-110, 35, 0], rightleg: [-5, 3, 3], leftleg: [5, -3, -3] },
    { id: 'entertain', labelKey: 'display_sensei.stand_pose.entertain', line: 134, body: [0, 0, 0], head: [-15, 0, 0], rightarm: [-110, 35, 0], leftarm: [-110, -35, 0], rightleg: [-5, 3, 3], leftleg: [5, -3, -3] },
    { id: 'salute', labelKey: 'display_sensei.stand_pose.salute', line: 264, body: [0, 0, 0], head: [0, 0, 0], rightarm: [-70, -40, 0], leftarm: [10, 0, -5], rightleg: [1, 0, 1], leftleg: [-1, 0, -1] },
    { id: 'riposte', labelKey: 'display_sensei.stand_pose.riposte', line: 238, body: [0, 0, 0], head: [16, 20, 0], rightarm: [246, 0, 89], leftarm: [4, 8, 237], rightleg: [8, 20, 4], leftleg: [-14, -18, -16], rightItem: [0, 180, 0] },
    { id: 'zombie', labelKey: 'display_sensei.stand_pose.zombie', line: 324, body: [0, 0, 0], head: [-10, 0, -5], rightarm: [-100, 0, 0], leftarm: [-105, 0, 0], rightleg: [-46, 0, 0], leftleg: [7, 0, 0] },
    { id: 'cancan_a', labelKey: 'display_sensei.stand_pose.cancan_a', line: 56, body: [0, 22, 0], head: [-5, 18, 0], rightarm: [0, 84, 111], leftarm: [8, 0, -114], rightleg: [0, 23, -13], leftleg: [-111, 55, 0] },
    { id: 'cancan_b', labelKey: 'display_sensei.stand_pose.cancan_b', line: 82, body: [0, -18, 0], head: [-10, -20, 0], rightarm: [8, 90, 111], leftarm: [0, 0, -112], rightleg: [-119, -42, 0], leftleg: [0, 0, 13] },
    { id: 'hero', labelKey: 'display_sensei.stand_pose.hero', line: 160, body: [0, 8, 0], head: [-4, 67, 0], rightarm: [-99, 63, 0], leftarm: [16, 32, -8], rightleg: [4, 63, 8], leftleg: [0, -75, -8] }
];
const STAND_DEFAULT_POSE = 0;
const STAND_POSED_START = 1;
const STAND_BODY_PIVOT = [0, 24, 0];

// =========================
// Vanilla numbers: first person
// =========================
const FIRST_PERSON_RIG = {
    shoulder: [-5, 22, 0],
    itemBone: [-6, 15, 1],
    armPos: [13.5, -10, 12],
    armRot: [95, -45, 115],
    itemPos: [0, 0, -1]
};

const FIRST_PERSON_RIG_VFOV = 70.25;
const DISPLAY_MODE_FIRST_PERSON_VFOV = 2 * Math.atan(0.5 * 35 / 18) / DEGREES;
const FIRST_PERSON_FOV_RATIO = Math.tan(FIRST_PERSON_RIG_VFOV / 2 * DEGREES) / Math.tan(DISPLAY_MODE_FIRST_PERSON_VFOV / 2 * DEGREES);

const BOW_WIELD = { pos: [-5.5, -3, -3], rot: [38, -120, -63] };
const BOW_PULL = { pos: [-1.5, 2.5, -4.8], rot: [-53, 8, 35] };

const FIRST_PERSON_RIG_EYE = [0, 27.41, 0];
const DISPLAY_MODE_FIRST_PERSON_CAMERA = [0, 24, 32.4];

const FIRST_PERSON_POSES = {
    hold: { used: {} },
    bow: { idle: { itemAnim: BOW_WIELD }, used: { itemAnim: { pos: addVectors(BOW_WIELD.pos, BOW_PULL.pos), rot: addVectors(BOW_WIELD.rot, BOW_PULL.rot) } } },
    crossbow: { used: { itemPos: [0, 2, 2.5], itemRot: [-20, -15, -30] } },
    spear: { used: { itemPos: addVectors(FIRST_PERSON_RIG.itemPos, [-1.5, 2, 3.5]), itemRot: [45, 55, -12.5] } },
    eat: { fromThirdPersonPose: 'eating', calibrated: false }
};

// =========================
// Vanilla numbers: world references
// =========================
const FRAME_ROTATION_STEP = 45;
const FRAME_ROTATION_STEPS = 8;
const FRAME_SCALE = 0.5;
const BLOCK_SIZE = 16;
const GLOW_FRAME_TINT = 'rgba(64, 224, 208, 0.55)';
const FALLBACK_FRAME_TEXTURE = 'assets/item_frame.png';
const CEILING_FRAME_CAMERA = { position: [-22, -8, -30], target: [8, 12, 8] };

const FOX_HELD_ITEM = [-2, 3.3, -13];
const FOX_HEAD_CENTRE = [0, 7, -6];
const BLOCKBENCH_FOX_HEAD_CENTRE = [0, 4, 0];

const POT_SOIL_Y = 4;

const SHELF_ITEM_Y = 8;
const SHELF_SCALE = FRAME_SCALE;
const SHELF_COPY_OFFSET = 5 / SHELF_SCALE;

const GROUND_SPIN_PER_SECOND = 1;
const GROUND_BOB_PER_SECOND = 2;
const GROUND_LIFT = 3.8;
const GROUND_BOB_AMPLITUDE = Math.PI / 2;
const GROUND_MAX_STEP_SECONDS = 0.25;

// =========================
// Vanilla numbers: GUI
// =========================
const GUI_AREA_SCALE = 0.4;
const GUI_ITEM_SIZE = 16;
const REFERENCE_IMAGE_UNITS_PER_PIXEL = 8;
const OVERLAY_DRAW_SCALE = 4;
const GUI_COLOURS = {
    slot: '#8B8B8B',
    shadow: '#373737',
    highlight: '#FFFFFF',
    panel: '#C6C6C6',
    outline: '#000000',
    hotbar: 'rgba(24, 24, 24, 0.72)',
    hotbarSlot: '#8B8B8B',
    selection: '#FFFFFF'
};
const GUI_SLOT_SIZE = 18;
const HOTBAR_SLOTS = 9;
const HOTBAR_PITCH = 20;
const HOTBAR_HEIGHT = 22;
const HOTBAR_SELECTION = 24;
const HOTBAR_SELECTED_SLOT = 4;
const INVENTORY_BORDER = 7;
const INVENTORY_GAP = 4;

// =========================
// Small helpers
// =========================
function addVectors(a, b) {
    return a.map((value, index) => value + b[index]);
}

// =========================
// Composer (matrices with THREE)
// =========================
function translationMatrix(vector) {
    return new THREE.Matrix4().makeTranslation(vector[0], vector[1], vector[2]);
}

function scaleMatrix(scale) {
    return new THREE.Matrix4().makeScale(scale, scale, scale);
}

function rotationMatrix(degrees, order) {
    let euler = new THREE.Euler(degrees[0] * DEGREES, degrees[1] * DEGREES, degrees[2] * DEGREES, order);
    return new THREE.Matrix4().makeRotationFromEuler(euler);
}

function chainMatrices(matrices) {
    let result = new THREE.Matrix4();
    for (let matrix of matrices) result.multiply(matrix);
    return result;
}

function boneMatrix({ pivot = [0, 0, 0], pos = [0, 0, 0], rot = [0, 0, 0] }) {
    let p = toBlockbenchPosition(pivot);
    return chainMatrices([
        translationMatrix(toBlockbenchPosition(pos)),
        translationMatrix(p),
        rotationMatrix(toBlockbenchRotation(rot), 'ZYX'),
        translationMatrix([-p[0], -p[1], -p[2]])
    ]);
}

function composeHeldItemFrame({ shoulder, itemBone, armRot, parents = [], itemAnim = null, entityScale = 1 }) {
    let s = toBlockbenchPosition(shoulder);
    let i = toBlockbenchPosition(itemBone);
    let matrices = [scaleMatrix(entityScale)].concat(parents.map(boneMatrix), [
        translationMatrix(s),
        rotationMatrix(toBlockbenchRotation(armRot), 'ZYX'),
        translationMatrix([i[0] - s[0], i[1] - s[1], i[2] - s[2]])
    ]);
    if (itemAnim) {
        matrices.push(translationMatrix(toBlockbenchPosition(itemAnim.pos || [0, 0, 0])));
        matrices.push(rotationMatrix(toBlockbenchRotation(itemAnim.rot || [0, 0, 0]), 'ZYX'));
    }
    matrices.push(translationMatrix(HOLD_OFFSET), rotationMatrix([HOLD_TURN_X, 0, 0], 'XYZ'));
    return chainMatrices(matrices);
}

function composeHeadFrame({ headPivot, centreOffset = HEAD_CENTRE_OFFSET, headRot = [0, 0, 0], parents = [], baseScale = HEAD_BASE_SCALE, entityScale = 1 }) {
    return chainMatrices([scaleMatrix(entityScale)].concat(parents.map(boneMatrix), [
        translationMatrix(toBlockbenchPosition(headPivot)),
        rotationMatrix(toBlockbenchRotation(headRot), 'ZYX'),
        translationMatrix([0, centreOffset, 0]),
        scaleMatrix(baseScale)
    ]));
}

function composeFirstPersonFrame({ armRot = FIRST_PERSON_RIG.armRot, itemPos = FIRST_PERSON_RIG.itemPos, itemRot = [0, 0, 0], itemAnim = null } = {}) {
    let s = toBlockbenchPosition(FIRST_PERSON_RIG.shoulder);
    let i = toBlockbenchPosition(FIRST_PERSON_RIG.itemBone);
    let matrices = [
        translationMatrix(s),
        translationMatrix(toBlockbenchPosition(FIRST_PERSON_RIG.armPos)),
        rotationMatrix(toBlockbenchRotation(armRot), 'ZYX'),
        translationMatrix([i[0] - s[0], i[1] - s[1], i[2] - s[2]]),
        translationMatrix(toBlockbenchPosition(itemPos)),
        rotationMatrix(toBlockbenchRotation(itemRot), 'ZYX')
    ];
    if (itemAnim) {
        matrices.push(translationMatrix(toBlockbenchPosition(itemAnim.pos)));
        matrices.push(rotationMatrix(toBlockbenchRotation(itemAnim.rot), 'ZYX'));
    }
    return chainMatrices(matrices);
}

function composeFirstPersonDelta(usedFrame, idleFrame, anchor) {
    let turn = new THREE.Matrix4().makeRotationY(Math.PI);
    let turnBack = turn.clone().invert();
    let change = usedFrame.clone().multiply(idleFrame.clone().invert());
    let rotation = turn.clone().multiply(change).multiply(turnBack);
    rotation.setPosition(0, 0, 0);
    let from = new THREE.Vector3().setFromMatrixPosition(idleFrame);
    let to = new THREE.Vector3().setFromMatrixPosition(usedFrame);
    let moved = to.sub(from).applyMatrix4(turn);
    let position = new THREE.Vector3().fromArray(anchor).addScaledVector(moved, FIRST_PERSON_FOV_RATIO);
    return translationMatrix(position.toArray()).multiply(rotation);
}

function composeFirstPersonFromThirdPerson(poseId) {
    let pose = ARM_POSES.find(entry => entry.id === poseId);
    let rig = THIRD_PERSON_RIGS.player_wide.right;
    let hold = composeHeldItemFrame(Object.assign({}, rig, { armRot: [-PLAYER_HOLD_ANGLE, 0, 0] }));
    let used = composeHeldItemFrame(Object.assign({}, rig, { armRot: pose.arm, itemAnim: pose.itemAnim || null }));
    let fromEyes = new THREE.Vector3().setFromMatrixPosition(used).sub(new THREE.Vector3().fromArray(FIRST_PERSON_RIG_EYE));
    let position = new THREE.Vector3().fromArray(DISPLAY_MODE_FIRST_PERSON_CAMERA).addScaledVector(fromEyes, FIRST_PERSON_FOV_RATIO);
    let turn = new THREE.Matrix4().extractRotation(used).multiply(new THREE.Matrix4().extractRotation(hold).invert());
    return translationMatrix(position.toArray()).multiply(turn);
}

function toSetBaseArgs(matrix) {
    let position = new THREE.Vector3();
    let quaternion = new THREE.Quaternion();
    let scale = new THREE.Vector3();
    matrix.decompose(position, quaternion, scale);
    let euler = new THREE.Euler().setFromQuaternion(quaternion, 'XYZ');
    return [position.x, position.y, position.z, euler.x / DEGREES, euler.y / DEGREES, euler.z / DEGREES, scale.x, scale.y, scale.z];
}

function mirrorSetBaseArgs(args) {
    let mirrored = args.slice();
    mirrored[0] = -mirrored[0];
    mirrored[4] = -mirrored[4];
    mirrored[5] = -mirrored[5];
    return mirrored;
}

// =========================
// Blockbench's own anchors (read at runtime)
// =========================
function readBlockbenchPlacement(referenceId, slotId) {
    let reference = displayReferenceObjects.refmodels[referenceId];
    let area = DisplayMode.display_area;
    if (!reference || typeof reference.updateBasePosition !== 'function' || !area) return null;
    let saved = { position: area.position.clone(), rotation: area.rotation.clone(), scale: area.scale.clone() };
    try {
        withTemporaryValue(DisplayMode, 'display_slot', slotId, () => reference.updateBasePosition());
        return [
            area.position.x, area.position.y, area.position.z,
            area.rotation.x / DEGREES, area.rotation.y / DEGREES, area.rotation.z / DEGREES,
            area.scale.x, area.scale.y, area.scale.z
        ];
    } catch (error) {
        console.warn(LOG_PREFIX, `Could not read Blockbench's ${referenceId} placement:`, error);
        return null;
    } finally {
        area.position.copy(saved.position);
        area.rotation.copy(saved.rotation);
        area.scale.copy(saved.scale);
        area.updateMatrixWorld();
    }
}

const FALLBACK_ANCHORS = {
    monitor: [9.039, 15.682, 20.8, 0, 0, 0, 1, 1, 1],
    frame: [8, 8, -1, 0, 0, 0, 0.5, 0.5, 0.5],
    frame_top: [8, 1, 8, 90, 0, 0, 0.5, 0.5, 0.5],
    fox: [0, 0, -6, 90, 180, 0, 1, 1, 1],
    shelf_left: [13, 7.75, 12, 0, 180, 0, 0.25, 0.25, 0.25],
    shelf_center: [8, 7.75, 12, 0, 180, 0, 0.25, 0.25, 0.25],
    shelf_right: [3, 7.75, 12, 0, 180, 0, 0.25, 0.25, 0.25]
};

function readAnchor(referenceId, slotId) {
    return readBlockbenchPlacement(referenceId, slotId) || FALLBACK_ANCHORS[referenceId].slice();
}

// =========================
// Placements
// =========================
function getArmPose(slotId) {
    let id = previewOptions.armPose[slotId] || 'holding';
    return ARM_POSES.find(pose => pose.id === id) || ARM_POSES[0];
}

function getStandPose(index) {
    return STAND_POSES[index] || STAND_POSES[STAND_DEFAULT_POSE];
}

function getPoseAngleValue(reference, slotId) {
    let spec = getPoseSpec(reference, slotId);
    let stored = reference.pose_angles[slotId];
    let angle = Number.isFinite(stored) ? stored : (spec ? spec.start : 0);
    return spec ? clampToRange(angle, [spec.min, spec.max]) : angle;
}

function placePlayer(reference, slotId) {
    let rigs = THIRD_PERSON_RIGS[reference.variant === 'alex' ? 'player_slim' : 'player_wide'];
    let meshPose = { rightArm: [0, 0, 0], leftArm: [0, 0, 0], head: [0, 0, 0], sneaking: false };
    let args = null;
    if (slotId === 'head') {
        let angle = getPoseAngleValue(reference, slotId);
        let headRot = [-angle, 0, 0];
        args = toSetBaseArgs(composeHeadFrame(Object.assign({}, HEAD_RIGS.player, { headRot, entityScale: PLAYER_ENTITY_SCALE })));
        meshPose.head = toBlockbenchRotation(headRot);
    } else if (THIRD_PERSON_SLOTS.includes(slotId)) {
        let left = isLeftHandSlot(slotId);
        let pose = getArmPose(slotId);
        let armRot = pose.arm ? pose.arm : [-getPoseAngleValue(reference, slotId), 0, 0];
        let frame = composeHeldItemFrame(Object.assign({}, left ? rigs.left : rigs.right, {
            armRot,
            parents: pose.parents || [],
            itemAnim: pose.itemAnim || null,
            entityScale: PLAYER_ENTITY_SCALE
        }));
        args = toSetBaseArgs(frame);
        meshPose.sneaking = pose.id === 'sneaking';
        let otherArm = meshPose.sneaking ? [SNEAK_OTHER_ARM, 0, 0] : [0, 0, 0];
        meshPose[left ? 'leftArm' : 'rightArm'] = toBlockbenchRotation(armRot);
        meshPose[left ? 'rightArm' : 'leftArm'] = toBlockbenchRotation(otherArm);
    }
    return { args, meshPose };
}

function placeZombie(rigId, headRig) {
    return function(reference, slotId) {
        if (slotId === 'head') {
            return { args: toSetBaseArgs(composeHeadFrame(headRig)) };
        }
        if (!THIRD_PERSON_SLOTS.includes(slotId)) return { args: null };
        let side = isLeftHandSlot(slotId) ? 'left' : 'right';
        let arms = getZombieArms(reference.ds_definition.kind, slotId);
        let frame = composeHeldItemFrame(Object.assign({}, THIRD_PERSON_RIGS[rigId][side], { armRot: arms[side] }));
        return { args: toSetBaseArgs(frame) };
    };
}

function placeArmorStand(reference, slotId) {
    let pose = getStandPose(reference.ds_definition.kind === 'armor_stand_posed' ? previewOptions.standPose : STAND_DEFAULT_POSE);
    let parents = [{ pivot: STAND_BODY_PIVOT, rot: pose.body }];
    let args = null;
    if (slotId === 'head') {
        args = toSetBaseArgs(composeHeadFrame(Object.assign({}, HEAD_RIGS.armor_stand, { headRot: pose.head, parents })));
    } else if (THIRD_PERSON_SLOTS.includes(slotId)) {
        let left = isLeftHandSlot(slotId);
        let rig = THIRD_PERSON_RIGS.armor_stand[left ? 'left' : 'right'];
        let itemAnim = !left && pose.rightItem ? { rot: pose.rightItem } : null;
        args = toSetBaseArgs(composeHeldItemFrame(Object.assign({}, rig, { armRot: left ? pose.leftarm : pose.rightarm, parents, itemAnim })));
    }
    return { args, meshPose: { standPose: pose } };
}

function placeFirstPerson(poseId) {
    return function(reference, slotId) {
        let pose = FIRST_PERSON_POSES[poseId];
        let args;
        if (pose.setBase) {
            args = pose.setBase.slice();
        } else if (pose.fromThirdPersonPose) {
            args = toSetBaseArgs(composeFirstPersonFromThirdPerson(pose.fromThirdPersonPose));
        } else {
            let anchor = readAnchor('monitor', 'firstperson_righthand').slice(0, 3);
            let idle = composeFirstPersonFrame(pose.idle || {});
            let used = composeFirstPersonFrame(pose.used || {});
            args = toSetBaseArgs(composeFirstPersonDelta(used, idle, anchor));
        }
        return { args: isLeftHandSlot(slotId) ? mirrorSetBaseArgs(args) : args };
    };
}

function getFrameRotation() {
    return previewOptions.frameStep * FRAME_ROTATION_STEP;
}

function placeFrame(where) {
    return function() {
        let args;
        if (where === 'wall') {
            args = readAnchor('frame', 'fixed');
        } else {
            args = readAnchor('frame_top', 'fixed');
            if (where === 'ceiling') {
                args[1] = BLOCK_SIZE - args[1];
                args[3] = -args[3];
            }
        }
        args[5] = getFrameRotation();
        args[6] = args[7] = args[8] = FRAME_SCALE;
        return { args };
    };
}

function placeFox() {
    let anchor = readAnchor('fox', 'ground');
    let position = toBlockbenchPosition(FOX_HELD_ITEM).map((value, axis) => value - FOX_HEAD_CENTRE[axis] + BLOCKBENCH_FOX_HEAD_CENTRE[axis]);
    return { args: position.concat(anchor.slice(3, 6), [1, 1, 1]) };
}

function placeFlowerPot() {
    let defaults = DisplayMode.bedrock_defaults && DisplayMode.bedrock_defaults.embedded;
    let scale = defaults ? defaults.scale[1] : 0.75;
    return { args: [0, POT_SOIL_Y + BLOCK_SIZE * scale / 2, 0, 0, 0, 0, 1, 1, 1] };
}

function placeShelf(blockbenchId) {
    return function() {
        let anchor = readAnchor(blockbenchId, 'on_shelf');
        return { args: [anchor[0], SHELF_ITEM_Y, anchor[2], 0, 0, 0, SHELF_SCALE, SHELF_SCALE, SHELF_SCALE] };
    };
}

function placeGui() {
    return { args: null };
}

// =========================
// Geometry
// =========================
function cloneBlockbenchModels(referenceId) {
    let reference = displayReferenceObjects.refmodels[referenceId];
    return reference && Array.isArray(reference.models) ? cloneJson(reference.models) : [];
}

function buildPlayerModels() {
    let models = cloneBlockbenchModels('player');
    for (let model of models) {
        model.texture = 'black';
        for (let element of model.elements || []) {
            let part = classifyPlayerElement(element);
            if (!element.name) element.name = part;
            if (part === 'right_arm' || part === 'left_arm') {
                let side = part === 'right_arm' ? 1 : -1;
                element.origin = [5 * side, element.model === 'alex' ? 21.5 : 22, 0];
                element.rotation = [0, 0, 0];
            }
        }
    }
    return models;
}

const PLAYER_PART_NAMES = ['body', 'right_leg', 'left_leg'];

function classifyPlayerElement(element) {
    let name = element.name || '';
    if (PLAYER_PART_NAMES.includes(name)) return name;
    if (name.startsWith('right_arm')) return 'right_arm';
    if (name.startsWith('left_arm')) return 'left_arm';
    if (name.startsWith('head')) return 'head';
    if (element.pos && element.pos[1] < 12) return element.pos[0] > 0 ? 'right_leg' : 'left_leg';
    return 'body';
}

function buildZombieModels() {
    let models = cloneBlockbenchModels('zombie');
    for (let model of models) {
        for (let element of model.elements || []) {
            let isArm = element.size && element.size[0] === 12 && element.pos && Math.abs(element.pos[2]) > 4;
            if (!isArm) continue;
            let right = element.pos[2] < 0;
            element.name = right ? 'right_arm' : 'left_arm';
            element.origin = [0, 16, right ? -5 : 5];
            element.rotation = [0, 0, 0];
        }
    }
    return models;
}

const STAND_HEAD_STICK_INDEX = 5;
const STAND_HEAD_STICK_Y = 27.5;

function buildArmorStandModels() {
    let models = cloneBlockbenchModels('armor_stand');
    let elements = models[0] && models[0].elements;
    if (elements && elements[STAND_HEAD_STICK_INDEX]) {
        elements[STAND_HEAD_STICK_INDEX].pos[1] = STAND_HEAD_STICK_Y;
    }
    return models;
}

const STAND_BONES = [
    { id: 'body', pivot: [0, 24, 0], meshes: [1, 2, 3, 4], parent: null },
    { id: 'head', pivot: [0, 24, 0], meshes: [5], parent: 'body' },
    { id: 'leftarm', pivot: [5, 22, 0], meshes: [6], parent: 'body' },
    { id: 'leftleg', pivot: [1.9, 12, 0], meshes: [7], parent: 'body' },
    { id: 'rightarm', pivot: [-5, 22, 0], meshes: [8], parent: 'body' },
    { id: 'rightleg', pivot: [-1.9, 12, 0], meshes: [9], parent: 'body' }
];

const BABY_ZOMBIE_BOXES = [
    { name: 'body', size: [4, 5, 2], pos: [0, 6.5, 0], skin: 'shirt' },
    { name: 'head', size: [6, 6, 6], pos: [0, 12, 0], origin: [0, 8.75, 0], skin: 'head' },
    { name: 'right_arm', size: [2, 5, 2], pos: [3, 6.5, 0], origin: [3, 8.5, 0], skin: 'skin' },
    { name: 'left_arm', size: [2, 5, 2], pos: [-3, 6.5, 0], origin: [-3, 8.5, 0], skin: 'skin' },
    { name: 'right_leg', size: [2, 4, 2], pos: [1, 2, 0], origin: [1, 4, 0], skin: 'trousers' },
    { name: 'left_leg', size: [2, 4, 2], pos: [-1, 2, 0], origin: [-1, 4, 0], skin: 'trousers' }
];
const BABY_ZOMBIE_TEXTURE_SIZE = 16;
const BABY_ZOMBIE_PATCHES = {
    skin: [0, 0, 4, 4],
    shirt: [4, 0, 8, 4],
    trousers: [8, 0, 12, 4],
    face: [0, 4, 6, 10]
};
const BABY_ZOMBIE_COLOURS = { skin: '#5D8A3C', shirt: '#2E9C9C', trousers: '#3A3F8F', eyes: '#1B2A12', mouth: '#2F4A1F' };

function drawBabyZombieTexture() {
    let scale = OVERLAY_DRAW_SCALE;
    let canvas = document.createElement('canvas');
    canvas.width = canvas.height = BABY_ZOMBIE_TEXTURE_SIZE * scale;
    let context = canvas.getContext('2d');
    let fill = (colour, [x1, y1, x2, y2]) => {
        context.fillStyle = colour;
        context.fillRect(x1 * scale, y1 * scale, (x2 - x1) * scale, (y2 - y1) * scale);
    };
    fill(BABY_ZOMBIE_COLOURS.skin, BABY_ZOMBIE_PATCHES.skin);
    fill(BABY_ZOMBIE_COLOURS.shirt, BABY_ZOMBIE_PATCHES.shirt);
    fill(BABY_ZOMBIE_COLOURS.trousers, BABY_ZOMBIE_PATCHES.trousers);
    fill(BABY_ZOMBIE_COLOURS.skin, BABY_ZOMBIE_PATCHES.face);
    fill(BABY_ZOMBIE_COLOURS.eyes, [1, 6, 2, 7]);
    fill(BABY_ZOMBIE_COLOURS.eyes, [4, 6, 5, 7]);
    fill(BABY_ZOMBIE_COLOURS.mouth, [2, 8, 4, 9]);
    return canvas.toDataURL('image/png');
}

function buildBabyZombieModels() {
    let patch = name => ({ uv: BABY_ZOMBIE_PATCHES[name].slice() });
    let elements = BABY_ZOMBIE_BOXES.map(box => {
        let side = patch(box.skin === 'head' ? 'skin' : box.skin);
        let element = { name: box.name, size: box.size.slice(), pos: box.pos.slice() };
        if (box.origin) element.origin = box.origin.slice();
        for (let face of ['north', 'east', 'south', 'west', 'up', 'down']) element[face] = cloneJson(side);
        if (box.skin === 'head') element.north = patch('face');
        return element;
    });
    return [{ texture: drawBabyZombieTexture(), texture_size: [BABY_ZOMBIE_TEXTURE_SIZE, BABY_ZOMBIE_TEXTURE_SIZE], elements }];
}

function buildFrameModels(blockbenchId, glow) {
    let models = cloneBlockbenchModels(blockbenchId);
    if (glow && glowFrameTexture) {
        for (let model of models) {
            if (isFrameBoardTexture(model.texture)) model.texture = glowFrameTexture;
        }
    }
    return models;
}

function isFrameBoardTexture(texture) {
    return typeof texture === 'string' && /item_frame/.test(texture);
}

// =========================
// Bedrock references
// =========================
const BEDROCK_REFERENCE_DEFINITIONS = [
    {
        id: 'bedrock_player', icon: 'icon-player', nameKey: 'display_sensei.reference.bedrock_player', noteKey: null, approximate: false,
        kind: 'player', models: buildPlayerModels, place: placePlayer,
        posable: {
            thirdperson_righthand: { start: PLAYER_HOLD_ANGLE, range: ARM_ANGLE_RANGE },
            thirdperson_lefthand: { start: PLAYER_HOLD_ANGLE, range: ARM_ANGLE_RANGE },
            head: { start: 0, range: HEAD_PITCH_RANGE }
        }
    },
    {
        id: 'bedrock_zombie', icon: 'icon-zombie', nameKey: 'display_sensei.reference.bedrock_zombie', noteKey: null, approximate: false,
        kind: 'zombie', models: buildZombieModels, place: placeZombie('zombie', HEAD_RIGS.zombie),
        container: { rotation: [0, -90, 0], position: [0, 6, 0] }
    },
    {
        id: 'bedrock_baby_zombie', icon: 'icon-baby_zombie', nameKey: 'display_sensei.reference.bedrock_baby_zombie',
        noteKey: 'display_sensei.reference_note.bedrock_baby_zombie', approximate: true,
        kind: 'baby_zombie', models: buildBabyZombieModels, place: placeZombie('baby_zombie', HEAD_RIGS.baby_zombie)
    },
    {
        id: 'bedrock_armor_stand', icon: 'icon-armor_stand', nameKey: 'display_sensei.reference.bedrock_armor_stand', noteKey: null, approximate: false,
        kind: 'armor_stand', models: buildArmorStandModels, place: placeArmorStand
    },
    {
        id: 'bedrock_armor_stand_posed', icon: 'accessibility_new', nameKey: 'display_sensei.reference.bedrock_armor_stand_posed',
        noteKey: 'display_sensei.reference_note.bedrock_armor_stand_posed', approximate: false,
        kind: 'armor_stand_posed', models: buildArmorStandModels, place: placeArmorStand
    },
    {
        id: 'bedrock_fp_hold', icon: 'fa-asterisk', nameKey: 'display_sensei.reference.bedrock_fp_hold',
        noteKey: 'display_sensei.reference_note.bedrock_fp_hold', approximate: true,
        kind: 'first_person', models: () => cloneBlockbenchModels('monitor'), place: placeFirstPerson('hold')
    },
    {
        id: 'bedrock_fp_bow', icon: 'icon-bow', nameKey: 'display_sensei.reference.bedrock_fp_bow',
        noteKey: 'display_sensei.reference_note.bedrock_fp_bow', approximate: true, mainHandOnly: true,
        kind: 'first_person', models: () => cloneBlockbenchModels('monitor'), place: placeFirstPerson('bow')
    },
    {
        id: 'bedrock_fp_crossbow', icon: 'icon-crossbow', nameKey: 'display_sensei.reference.bedrock_fp_crossbow',
        noteKey: 'display_sensei.reference_note.bedrock_fp_crossbow', approximate: true, mainHandOnly: true,
        kind: 'first_person', models: () => cloneBlockbenchModels('monitor'), place: placeFirstPerson('crossbow')
    },
    {
        id: 'bedrock_fp_spear', icon: 'north_east', nameKey: 'display_sensei.reference.bedrock_fp_spear',
        noteKey: 'display_sensei.reference_note.bedrock_fp_spear', approximate: true, mainHandOnly: true,
        kind: 'first_person', models: () => cloneBlockbenchModels('monitor'), place: placeFirstPerson('spear')
    },
    {
        id: 'bedrock_fp_eat', icon: 'fa-apple-whole', nameKey: 'display_sensei.reference.bedrock_fp_eat',
        noteKey: 'display_sensei.reference_note.bedrock_fp_eat', approximate: !FIRST_PERSON_POSES.eat.calibrated, mainHandOnly: true,
        kind: 'first_person', models: () => cloneBlockbenchModels('monitor'), place: placeFirstPerson('eat')
    },
    {
        id: 'bedrock_fox', icon: 'pets', nameKey: 'display_sensei.reference.bedrock_fox',
        noteKey: 'display_sensei.reference_note.bedrock_fox', approximate: true, stopsGround: true,
        kind: 'fox', models: () => cloneBlockbenchModels('fox'), place: placeFox
    },
    {
        id: 'bedrock_frame', icon: 'filter_frames', nameKey: 'display_sensei.reference.bedrock_frame', noteKey: null, approximate: false,
        kind: 'frame', frame: true, models: () => buildFrameModels('frame', false), place: placeFrame('wall')
    },
    {
        id: 'bedrock_glow_frame', icon: 'flare', nameKey: 'display_sensei.reference.bedrock_glow_frame',
        noteKey: 'display_sensei.reference_note.bedrock_glow_frame', approximate: false,
        kind: 'frame', frame: true, glow: true, models: () => buildFrameModels('frame', true), place: placeFrame('wall')
    },
    {
        id: 'bedrock_frame_floor', icon: 'vertical_align_bottom', nameKey: 'display_sensei.reference.bedrock_frame_floor', noteKey: null, approximate: false,
        kind: 'frame', frame: true, models: () => buildFrameModels('frame_top', false), place: placeFrame('floor')
    },
    {
        id: 'bedrock_glow_frame_floor', icon: 'flare', nameKey: 'display_sensei.reference.bedrock_glow_frame_floor',
        noteKey: 'display_sensei.reference_note.bedrock_glow_frame', approximate: false,
        kind: 'frame', frame: true, glow: true, models: () => buildFrameModels('frame_top', true), place: placeFrame('floor')
    },
    {
        id: 'bedrock_frame_ceiling', icon: 'vertical_align_top', nameKey: 'display_sensei.reference.bedrock_frame_ceiling', noteKey: null, approximate: true,
        kind: 'frame', frame: true, models: () => buildFrameModels('frame_top', false), place: placeFrame('ceiling'),
        container: { rotation: [180, 0, 0], position: [0, BLOCK_SIZE, BLOCK_SIZE] },
        camera: CEILING_FRAME_CAMERA
    },
    {
        id: 'bedrock_glow_frame_ceiling', icon: 'flare', nameKey: 'display_sensei.reference.bedrock_glow_frame_ceiling', noteKey: null, approximate: true,
        kind: 'frame', frame: true, glow: true, models: () => buildFrameModels('frame_top', true), place: placeFrame('ceiling'),
        container: { rotation: [180, 0, 0], position: [0, BLOCK_SIZE, BLOCK_SIZE] },
        camera: CEILING_FRAME_CAMERA
    },
    {
        id: 'bedrock_flower_pot', icon: 'potted_plant', nameKey: 'display_sensei.reference.bedrock_flower_pot',
        noteKey: 'display_sensei.reference_note.bedrock_flower_pot', approximate: true,
        kind: 'flower_pot', models: () => cloneBlockbenchModels('flower_pot'), place: placeFlowerPot
    },
    {
        id: 'bedrock_shelf', icon: 'table_view', nameKey: 'display_sensei.reference.bedrock_shelf',
        noteKey: 'display_sensei.reference_note.bedrock_shelf', approximate: true, shelfCopies: true,
        kind: 'shelf', models: () => cloneBlockbenchModels('shelf'), place: placeShelf('shelf_center')
    },
    {
        id: 'bedrock_shelf_left', icon: 'keyboard_arrow_left', nameKey: 'display_sensei.reference.bedrock_shelf_left',
        noteKey: 'display_sensei.reference_note.bedrock_shelf', approximate: true,
        kind: 'shelf', models: () => cloneBlockbenchModels('shelf'), place: placeShelf('shelf_left')
    },
    {
        id: 'bedrock_shelf_center', icon: 'remove', nameKey: 'display_sensei.reference.bedrock_shelf_center',
        noteKey: 'display_sensei.reference_note.bedrock_shelf', approximate: true,
        kind: 'shelf', models: () => cloneBlockbenchModels('shelf'), place: placeShelf('shelf_center')
    },
    {
        id: 'bedrock_shelf_right', icon: 'keyboard_arrow_right', nameKey: 'display_sensei.reference.bedrock_shelf_right',
        noteKey: 'display_sensei.reference_note.bedrock_shelf', approximate: true,
        kind: 'shelf', models: () => cloneBlockbenchModels('shelf'), place: placeShelf('shelf_right')
    },
    {
        id: 'bedrock_gui_grid', icon: 'icon-inventory_nine', nameKey: 'display_sensei.reference.bedrock_gui_grid', noteKey: null, approximate: false,
        kind: 'gui', models: () => [], place: placeGui
    },
    {
        id: 'bedrock_gui_inventory', icon: 'icon-inventory_full', nameKey: 'display_sensei.reference.bedrock_gui_inventory', noteKey: null, approximate: false,
        kind: 'gui', models: () => [], place: placeGui
    },
    {
        id: 'bedrock_gui_hotbar', icon: 'icon-hud', nameKey: 'display_sensei.reference.bedrock_gui_hotbar', noteKey: null, approximate: false,
        kind: 'gui', models: () => [], place: placeGui
    }
];

const BEDROCK_REFERENCE_FOR_BLOCKBENCH = {
    player: 'bedrock_player',
    zombie: 'bedrock_zombie',
    baby_zombie: 'bedrock_baby_zombie',
    armor_stand: 'bedrock_armor_stand',
    armor_stand_small: 'bedrock_armor_stand_posed',
    monitor: 'bedrock_fp_hold',
    bow: 'bedrock_fp_bow',
    crossbow: 'bedrock_fp_crossbow',
    tooting: 'bedrock_fp_spear',
    eating: 'bedrock_fp_eat',
    block: 'block',
    fox: 'bedrock_fox',
    frame: 'bedrock_frame',
    frame_invisible: 'bedrock_glow_frame',
    frame_top: 'bedrock_frame_floor',
    frame_top_invisible: 'bedrock_glow_frame_floor',
    flower_pot: 'bedrock_flower_pot',
    shelf: 'bedrock_shelf',
    shelf_left: 'bedrock_shelf_left',
    shelf_center: 'bedrock_shelf_center',
    shelf_right: 'bedrock_shelf_right',
    inventory_nine: 'bedrock_gui_grid',
    inventory_full: 'bedrock_gui_inventory',
    hud: 'bedrock_gui_hotbar'
};

const BEDROCK_REFERENCE_EXTRAS = {
    fixed: ['bedrock_frame_ceiling', 'bedrock_glow_frame_ceiling']
};

// =========================
// Preview options (preview only, never saved)
// =========================
let previewOptions = createPreviewOptions();

function createPreviewOptions() {
    return {
        armPose: { thirdperson_righthand: 'holding', thirdperson_lefthand: 'holding' },
        standPose: STAND_POSED_START,
        frameStep: 0,
        faceDimming: true,
        fitPreview: true
    };
}

// =========================
// Creating the references
// =========================
let bedrockReferences = {};

function getBedrockReference(id) {
    return bedrockReferences[id] || null;
}

function getReferenceDefinition(reference) {
    return reference && reference.ds_definition ? reference.ds_definition : null;
}

function findReferenceClass() {
    let player = displayReferenceObjects && displayReferenceObjects.refmodels && displayReferenceObjects.refmodels.player;
    let ReferenceClass = player && player.constructor;
    if (typeof ReferenceClass !== 'function' || !ReferenceClass.prototype ||
        typeof ReferenceClass.prototype.load !== 'function' || typeof ReferenceClass.prototype.buildModel !== 'function') {
        return null;
    }
    return ReferenceClass;
}

function createBedrockReference(ReferenceClass, definition) {
    let reference = new ReferenceClass(definition.id, {
        icon: definition.icon,
        models: definition.models(),
        condition: { formats: [BLOCK_FORMAT_ID] }
    });
    Object.defineProperty(reference, 'name', { configurable: true, enumerable: true, get: () => i18n(definition.nameKey) });
    reference.ds_definition = definition;
    reference.pose_angles = {};
    if (definition.posable) {
        for (let [slotId, pose] of Object.entries(definition.posable)) reference.pose_angles[slotId] = pose.start;
    }
    if (definition.container) {
        let { rotation = [0, 0, 0], position = [0, 0, 0] } = definition.container;
        reference.model.rotation.set(rotation[0] * DEGREES, rotation[1] * DEGREES, rotation[2] * DEGREES);
        reference.model.position.fromArray(position);
    }
    reference.updateBasePosition = function() {
        placeBedrockReference(this);
    };
    reference.load = function(index) {
        ReferenceClass.prototype.load.call(this, index);
        afterBedrockReferenceLoad(this);
    };
    return reference;
}

function registerBedrockReferences(ReferenceClass) {
    let refmodels = displayReferenceObjects.refmodels;
    for (let definition of BEDROCK_REFERENCE_DEFINITIONS) {
        let reference = createBedrockReference(ReferenceClass, definition);
        Object.defineProperty(refmodels, definition.id, { configurable: true, enumerable: false, writable: true, value: reference });
        bedrockReferences[definition.id] = reference;
    }
    return {
        delete() {
            for (let [id, reference] of Object.entries(bedrockReferences)) {
                if (displayReferenceObjects.active === reference) displayReferenceObjects.clear();
                disposeReference(reference);
                if (refmodels[id] === reference) delete refmodels[id];
            }
            bedrockReferences = {};
        }
    };
}

function disposeReference(reference) {
    let player = displayReferenceObjects.refmodels.player;
    let shared = player ? player.material : null;
    let materials = new Set();
    reference.model.traverse(object => {
        if (object.isMesh) {
            if (object.geometry) object.geometry.dispose();
            materials.add(object.material);
        }
    });
    materials.forEach(material => {
        if (!material || material === shared) return;
        if (material.map) material.map.dispose();
        material.dispose();
    });
    if (reference.model.parent) reference.model.parent.remove(reference.model);
}

// =========================
// Placing a reference
// =========================
function placeBedrockReference(reference) {
    let definition = getReferenceDefinition(reference);
    let slotId = DisplayMode.display_slot;
    if (!definition || !slotId) return;
    let placement = definition.place(reference, slotId) || {};
    if (placement.args) DisplayMode.setBase(...placement.args);
    if (reference.ds_prepared) poseReferenceMeshes(reference, placement.meshPose || null);
    if (definition.kind === 'gui') applyGuiDisplayArea();
    if (definition.shelfCopies) updateShelfCopies(reference);
}

function poseReferenceMeshes(reference, meshPose) {
    let kind = reference.ds_definition.kind;
    if (kind === 'player') posePlayerMeshes(reference, meshPose);
    if (kind === 'armor_stand' || kind === 'armor_stand_posed') poseStandBones(reference, meshPose && meshPose.standPose);
    if (kind === 'zombie' || kind === 'baby_zombie') poseZombieMeshes(reference);
}

function setMeshRotation(object, degrees) {
    object.rotation.set(degrees[0] * DEGREES, degrees[1] * DEGREES, degrees[2] * DEGREES, 'ZYX');
}

function posePlayerMeshes(reference, meshPose) {
    let pose = meshPose || { rightArm: [0, 0, 0], leftArm: [0, 0, 0], head: [0, 0, 0], sneaking: false };
    let container = reference.model;
    container.scale.setScalar(PLAYER_ENTITY_SCALE);
    if (pose.sneaking) {
        let root = SNEAK_PARENTS[0];
        container.position.fromArray(toBlockbenchPosition(root.pos).map(value => value * PLAYER_ENTITY_SCALE));
        setMeshRotation(container, toBlockbenchRotation(root.rot));
    } else {
        container.position.set(0, 0, 0);
        container.rotation.set(0, 0, 0);
    }
    let bodyDrop = pose.sneaking ? SNEAK_PARENTS[1].pos[1] : 0;
    for (let mesh of container.children) {
        let part = mesh.userData.ds_part;
        let origin = mesh.userData.ds_origin;
        if (!part || !origin) continue;
        mesh.position.copy(origin);
        if (part === 'right_arm' || part === 'left_arm') {
            mesh.position.y += bodyDrop;
            setMeshRotation(mesh, part === 'right_arm' ? pose.rightArm : pose.leftArm);
        } else if (part === 'head') {
            mesh.position.y += bodyDrop + (pose.sneaking ? SNEAK_HEAD_DROP : 0);
            setMeshRotation(mesh, pose.head);
        } else if (part === 'body') {
            mesh.position.y += bodyDrop;
            mesh.rotation.set(0, 0, 0);
        } else {
            setMeshRotation(mesh, pose.sneaking ? toBlockbenchRotation([SNEAK_LEG_TURN, 0, 0]) : [0, 0, 0]);
        }
    }
}

function poseStandBones(reference, pose) {
    let bones = reference.ds_bones;
    if (!bones || !pose) return;
    for (let [id, group] of Object.entries(bones)) {
        setMeshRotation(group, toBlockbenchRotation(pose[id] || [0, 0, 0]));
    }
}

function poseZombieMeshes(reference) {
    let arms = getZombieArms(reference.ds_definition.kind, DisplayMode.display_slot);
    let container = new THREE.Matrix4().makeRotationFromEuler(reference.model.rotation);
    let containerInverse = container.clone().invert();
    let lowered = new THREE.Matrix4().makeRotationX(-Math.PI / 2);
    let raisedRest = reference.ds_definition.kind === 'zombie';
    for (let mesh of reference.model.children) {
        let side = mesh.name === 'right_arm' ? 'right' : mesh.name === 'left_arm' ? 'left' : null;
        if (!side) continue;
        let rotation = toBlockbenchRotation(arms[side]);
        if (!raisedRest) {
            setMeshRotation(mesh, rotation);
            continue;
        }
        let matrix = containerInverse.clone().multiply(rotationMatrix(rotation, 'ZYX')).multiply(lowered).multiply(container);
        mesh.rotation.setFromRotationMatrix(matrix);
    }
}

// =========================
// After a load
// =========================
let isDrawingBar = false;

function afterBedrockReferenceLoad(reference) {
    let definition = getReferenceDefinition(reference);
    if (!definition) return;
    if (!reference.ds_prepared) prepareBuiltReference(reference);
    if (definition.kind === 'player') sharePlayerMaterial(reference);
    reference.updateBasePosition();
    syncBlockbenchPoseSlider(reference);
    if (definition.stopsGround && DisplayMode.display_slot === 'ground') Canvas.ground_animation = false;
    applyReferenceCamera(reference);
    if (!isDrawingBar) aimThirdPersonCamera();
}

let savedSlotCamera = null;

function applyReferenceCamera(reference) {
    let preview = getDisplayPreview();
    let slotId = DisplayMode.display_slot;
    let camera = getReferenceDefinition(reference).camera;
    if (!preview) return;
    if (camera) {
        if (!savedSlotCamera || savedSlotCamera.slotId !== slotId) {
            savedSlotCamera = {
                slotId,
                preset: { projection: 'perspective', position: preview.camera.position.toArray(), target: preview.controls.target.toArray() }
            };
        }
        preview.loadAnglePreset({ projection: 'perspective', position: camera.position.slice(), target: camera.target.slice() });
    } else if (savedSlotCamera && savedSlotCamera.slotId === slotId) {
        preview.loadAnglePreset(savedSlotCamera.preset);
        savedSlotCamera = null;
    }
}

function prepareBuiltReference(reference) {
    if (!reference.initialized) return;
    let kind = reference.ds_definition.kind;
    if (kind === 'player') preparePlayerMeshes(reference);
    if (kind === 'armor_stand' || kind === 'armor_stand_posed') prepareStandBones(reference);
    if (reference.ds_definition.glow) applyGlowTextureTo(reference);
    reference.ds_prepared = true;
}

function preparePlayerMeshes(reference) {
    for (let mesh of reference.model.children) {
        mesh.userData.ds_part = classifyPlayerElement({ name: mesh.name });
        mesh.userData.ds_origin = mesh.position.clone();
    }
    let player = ensureBlockbenchPlayerBuilt();
    let ReferenceClass = reference.constructor;
    ReferenceClass.prototype.setModelVariant.call(reference, (player && player.variant) || 'steve');
}

function ensureBlockbenchPlayerBuilt() {
    let player = displayReferenceObjects.refmodels.player;
    if (!player) return null;
    if (!player.initialized) {
        for (let model of player.models) player.buildModel(model);
        player.setModelVariant('steve');
        player.initialized = true;
        if (typeof DisplayMode.updateDisplaySkin === 'function') DisplayMode.updateDisplaySkin();
    }
    return player;
}

function sharePlayerMaterial(reference) {
    let player = ensureBlockbenchPlayerBuilt();
    if (!player || !player.material) return;
    reference.model.traverse(object => {
        if (!object.isMesh || object.material === player.material) return;
        let own = object.material;
        object.material = player.material;
        if (own && own !== player.material && !isMaterialUsed(reference.model, own)) own.dispose();
    });
    reference.material = player.material;
}

function isMaterialUsed(model, material) {
    let used = false;
    model.traverse(object => {
        if (object.isMesh && object.material === material) used = true;
    });
    return used;
}

function prepareStandBones(reference) {
    let meshes = reference.model.children.slice();
    let groups = {};
    let pivots = {};
    for (let bone of STAND_BONES) {
        let pivot = toBlockbenchPosition(bone.pivot);
        let group = new THREE.Object3D();
        group.name = `ds_bone_${bone.id}`;
        let parentPivot = bone.parent ? pivots[bone.parent] : [0, 0, 0];
        group.position.set(pivot[0] - parentPivot[0], pivot[1] - parentPivot[1], pivot[2] - parentPivot[2]);
        (bone.parent ? groups[bone.parent] : reference.model).add(group);
        for (let index of bone.meshes) {
            let mesh = meshes[index];
            if (!mesh) continue;
            group.add(mesh);
            mesh.position.set(mesh.position.x - pivot[0], mesh.position.y - pivot[1], mesh.position.z - pivot[2]);
        }
        groups[bone.id] = group;
        pivots[bone.id] = pivot;
    }
    reference.ds_bones = groups;
}

function syncBlockbenchPoseSlider(reference) {
    if (!DisplayMode.vue) return;
    DisplayMode.vue.reference_model = getPoseSpec(reference, DisplayMode.display_slot) ? 'player' : reference.id;
}

// =========================
// Pose angle (used by native_display_panel.js)
// =========================
function getPoseSpec(reference, slotId) {
    let definition = getReferenceDefinition(reference);
    if (!definition || !definition.posable || !definition.posable[slotId]) return null;
    if (THIRD_PERSON_SLOTS.includes(slotId) && getArmPose(slotId).id !== 'holding') return null;
    let pose = definition.posable[slotId];
    return { start: pose.start, min: pose.range[0], max: pose.range[1] };
}

function getPosableReferences() {
    return Object.values(bedrockReferences).filter(reference => reference.ds_definition.posable);
}

function getTunedHoldPosition(reference) {
    let definition = getReferenceDefinition(reference);
    if (!definition || definition.kind !== 'player') return null;
    let rig = THIRD_PERSON_RIGS[reference.variant === 'alex' ? 'player_slim' : 'player_wide'].right;
    let frame = composeHeldItemFrame(Object.assign({}, rig, { armRot: [-PLAYER_HOLD_ANGLE, 0, 0], entityScale: PLAYER_ENTITY_SCALE }));
    return toSetBaseArgs(frame).slice(0, 3);
}

// =========================
// Notes and estimates (getReferenceChoices())
// =========================
const ANCHOR_NOTE_KEYS = {
    hold: 'display_sensei.reference_note.hold_rule',
    head: 'display_sensei.reference_note.head_anchor',
    frame: 'display_sensei.reference_note.frame_anchor',
    gui: 'display_sensei.reference_note.gui_facing',
    ground: 'display_sensei.reference_note.ground_motion'
};
const HOLDER_KINDS = ['player', 'zombie', 'baby_zombie', 'armor_stand', 'armor_stand_posed'];

function getAnchorNoteKey(definition, reference, slotId) {
    if (!definition) {
        let isGroundBlock = !!reference && reference.id === 'block' && slotId === 'ground' && getRoute() === 'block';
        return isGroundBlock ? ANCHOR_NOTE_KEYS.ground : null;
    }
    if (HOLDER_KINDS.includes(definition.kind)) {
        if (THIRD_PERSON_SLOTS.includes(slotId)) return ANCHOR_NOTE_KEYS.hold;
        if (slotId === 'head') return ANCHOR_NOTE_KEYS.head;
    }
    if (definition.frame) return ANCHOR_NOTE_KEYS.frame;
    if (definition.kind === 'gui') return ANCHOR_NOTE_KEYS.gui;
    return null;
}

function describeReference(reference, slotId) {
    let definition = getReferenceDefinition(reference);
    let notes = [];
    if (definition && definition.noteKey) notes.push(i18n(definition.noteKey));
    if (definition && definition.mainHandOnly && slotId === 'firstperson_lefthand') notes.push(i18n('display_sensei.reference_note.main_hand_only'));
    let anchorKey = getAnchorNoteKey(definition, reference, slotId);
    if (anchorKey) notes.push(i18n(anchorKey));
    return { note: notes.join(' '), approximate: !!definition && !!definition.approximate };
}

// =========================
// A hand slot's reference without loading it (used by hand_views.js)
// =========================
const HAND_SLOT_REFERENCE_KINDS = {
    thirdperson_righthand: HOLDER_KINDS,
    thirdperson_lefthand: HOLDER_KINDS,
    firstperson_righthand: ['first_person'],
    firstperson_lefthand: ['first_person']
};

function getSlotReferenceIds(slotId) {
    let kinds = HAND_SLOT_REFERENCE_KINDS[slotId] || [];
    let drawn = referenceIdsBySlot[slotId];
    let ids = drawn ? drawn.map(id => BEDROCK_REFERENCE_FOR_BLOCKBENCH[id] || id) :
        BEDROCK_REFERENCE_DEFINITIONS.filter(definition => kinds.includes(definition.kind)).map(definition => definition.id);
    let refmodels = displayReferenceObjects.refmodels;
    return ids.filter(id => refmodels[id] && Condition(refmodels[id]));
}

function buildReferenceWithoutLoading(reference) {
    if (!reference.initialized) {
        for (let model of reference.models) reference.buildModel(model);
        reference.initialized = true;
    }
    let definition = getReferenceDefinition(reference);
    if (!definition) return;
    if (!reference.ds_prepared) prepareBuiltReference(reference);
    if (definition.kind === 'player') sharePlayerMaterial(reference);
}

function getSlotReference(slotId) {
    if (getRoute() !== 'block' || !HAND_SLOT_REFERENCE_KINDS[slotId]) return null;
    let ids = getSlotReferenceIds(slotId);
    if (!ids.length) return null;
    let index = displayReferenceObjects.ref_indexes[slotId] || 0;
    let reference = displayReferenceObjects.refmodels[ids[index] || ids[0]];
    buildReferenceWithoutLoading(reference);
    return reference;
}

function placeReferenceForSlot(reference) {
    if (getReferenceDefinition(reference)) {
        placeBedrockReference(reference);
    } else if (typeof reference.updateBasePosition === 'function') {
        reference.updateBasePosition();
    }
}

// =========================
// Remembered reference per slot
// =========================
function splitRememberedReferences() {
    let blockbenchIndexes = displayReferenceObjects.ref_indexes;
    let bedrockIndexes = {};
    for (let slotId of displayReferenceObjects.slots || Object.keys(blockbenchIndexes)) bedrockIndexes[slotId] = 0;
    Object.defineProperty(displayReferenceObjects, 'ref_indexes', {
        configurable: true,
        enumerable: true,
        get() {
            return getRoute() === 'block' ? bedrockIndexes : blockbenchIndexes;
        },
        set(value) {
            if (getRoute() === 'block') bedrockIndexes = value;
            else blockbenchIndexes = value;
        }
    });
    return {
        delete() {
            delete displayReferenceObjects.ref_indexes;
            displayReferenceObjects.ref_indexes = blockbenchIndexes;
        }
    };
}

// =========================
// The reference bar
// =========================
let blockbenchIdsBySlot = {};
let unmappedBlockbenchIds = new Set();

function toBedrockReferenceIds(slotId, blockbenchIds) {
    let ids = blockbenchIds.map(id => {
        if (BEDROCK_REFERENCE_FOR_BLOCKBENCH[id]) return BEDROCK_REFERENCE_FOR_BLOCKBENCH[id];
        if (!unmappedBlockbenchIds.has(id)) {
            unmappedBlockbenchIds.add(id);
            console.warn(LOG_PREFIX, `Blockbench offers the reference model "${id}", which has no Bedrock version; it is shown as it is.`);
        }
        return id;
    });
    return ids.concat(BEDROCK_REFERENCE_EXTRAS[slotId] || []);
}

function wrapBedrockReferenceBar() {
    return wrapMethod(displayReferenceObjects, 'bar', function(original, args) {
        let blockbenchIds = args[0];
        if (!Array.isArray(blockbenchIds)) return original.apply(this, args);
        let slotId = DisplayMode.display_slot;
        blockbenchIdsBySlot[slotId] = blockbenchIds.slice();
        if (getRoute() !== 'block') return original.apply(this, args);
        if (slotId === 'ground') resetGroundClock();
        savedSlotCamera = null;
        isDrawingBar = true;
        try {
            return original.apply(this, [toBedrockReferenceIds(slotId, blockbenchIds)].concat(args.slice(1)));
        } finally {
            isDrawingBar = false;
        }
    });
}

function getBlockbenchIdsForSlot(slotId) {
    if (blockbenchIdsBySlot[slotId]) return blockbenchIdsBySlot[slotId].slice();
    let shown = referenceIdsBySlot[slotId] || [];
    let blockbenchFor = {};
    for (let [blockbenchId, bedrockId] of Object.entries(BEDROCK_REFERENCE_FOR_BLOCKBENCH)) blockbenchFor[bedrockId] = blockbenchId;
    return shown.filter(id => blockbenchFor[id] || !getBedrockReference(id)).map(id => blockbenchFor[id] || id);
}

function showBedrockReferencesNow() {
    if (!Modes.display || getRoute() !== 'block' || !DisplayMode.display_slot) return;
    let ids = getBlockbenchIdsForSlot(DisplayMode.display_slot);
    if (!ids.length) return;
    displayReferenceObjects.bar(ids);
    markBlockbenchReferenceButton(displayReferenceObjects.active ? displayReferenceObjects.active.id : null);
    DisplayMode.updateDisplayBase();
}

function showBlockbenchReferencesAgain(slotId, blockbenchIds) {
    if (!Modes.display || getRoute() !== 'block' || DisplayMode.display_slot !== slotId || !blockbenchIds.length) return;
    if (slotId === 'gui') DisplayMode.setBase(0, 0, 0, 0, 0, 0, GUI_AREA_SCALE, GUI_AREA_SCALE, GUI_AREA_SCALE);
    displayReferenceObjects.bar(blockbenchIds);
    markBlockbenchReferenceButton(displayReferenceObjects.active ? displayReferenceObjects.active.id : null);
    DisplayMode.updateDisplayBase();
}

// =========================
// Ground
// =========================
let groundClock = { seconds: 0, last: null };

function resetGroundClock() {
    groundClock = { seconds: 0, last: null };
}

function animateBedrockGround(original, args) {
    if (getRoute() !== 'block') return original.apply(this, args);
    let now = performance.now() / 1000;
    if (groundClock.last !== null) {
        groundClock.seconds += Math.min(Math.max(now - groundClock.last, 0), GROUND_MAX_STEP_SECONDS);
    }
    groundClock.last = now;
    let seconds = groundClock.seconds;
    let area = DisplayMode.display_area;
    area.rotation.y = seconds * GROUND_SPIN_PER_SECOND;
    area.position.y = GROUND_LIFT + GROUND_BOB_AMPLITUDE * Math.sin(GROUND_BOB_PER_SECOND * seconds);
    Transformer.center();
}

function followGroundRestHeight() {
    let block = displayReferenceObjects.refmodels.block;
    if (!block || typeof block.updateBasePosition !== 'function') return { delete() {} };
    let hadOwn = Object.prototype.hasOwnProperty.call(block, 'updateBasePosition');
    let original = block.updateBasePosition;
    let active = true;
    let wrapper = function() {
        let result = original.apply(this, arguments);
        if (active && getRoute() === 'block' && DisplayMode.display_slot === 'ground' && DisplayMode.display_area) {
            DisplayMode.display_area.position.y = GROUND_LIFT;
            DisplayMode.display_area.updateMatrixWorld();
            Transformer.center();
        }
        return result;
    };
    block.updateBasePosition = wrapper;
    return {
        delete() {
            active = false;
            if (block.updateBasePosition !== wrapper) return;
            if (hadOwn) block.updateBasePosition = original;
            else delete block.updateBasePosition;
        }
    };
}

// =========================
// Shelf copies
// =========================
function updateShelfCopies(reference) {
    let area = DisplayMode.display_area;
    let base = DisplayMode.display_base;
    if (!reference.shelf_displays) {
        reference.shelf_displays = [-SHELF_COPY_OFFSET, SHELF_COPY_OFFSET].map((offset, index) => {
            let group = new THREE.Object3D();
            group.name = `ds_shelf_copy_${index}`;
            group.userData.ds_offset = offset;
            area.add(group);
            return group;
        });
    }
    for (let group of reference.shelf_displays) {
        if (group.children.length !== base.children.length) {
            group.children.slice().forEach(child => group.remove(child));
            base.children.forEach(child => group.add(child.clone()));
        }
        let position = base.position.clone();
        position.x += group.userData.ds_offset;
        group.matrix.compose(position, base.quaternion, base.scale);
        group.matrixAutoUpdate = false;
        group.matrixWorldNeedsUpdate = true;
    }
}

// =========================
// GUI: Fit to Frame preview
// =========================
function isGuiFitPreviewOn() {
    return previewOptions.fitPreview && !!Project && getProjectData().gui_fit_to_frame;
}

function measureModelInGuiView() {
    let base = DisplayMode.display_base;
    base.updateMatrixWorld(true);
    let toBase = base.matrixWorld.clone().invert();
    let turnAndScale = new THREE.Matrix4().compose(new THREE.Vector3(), base.quaternion, base.scale);
    let box = new THREE.Box3();
    let point = new THREE.Vector3();
    for (let element of Outliner.elements) {
        let mesh = element.mesh;
        let positions = mesh && mesh.geometry && mesh.geometry.attributes && mesh.geometry.attributes.position;
        if (!positions || element.visibility === false) continue;
        mesh.updateMatrixWorld(true);
        let toArea = turnAndScale.clone().multiply(toBase).multiply(mesh.matrixWorld);
        for (let index = 0; index < positions.count; index++) {
            box.expandByPoint(point.fromBufferAttribute(positions, index).applyMatrix4(toArea));
        }
    }
    return box;
}

function applyGuiDisplayArea() {
    if (!Modes.display || getRoute() !== 'block' || DisplayMode.display_slot !== 'gui') return;
    let box = isGuiFitPreviewOn() ? measureModelInGuiView() : null;
    let size = box && !box.isEmpty() ? Math.max(box.max.x - box.min.x, box.max.y - box.min.y) : 0;
    if (!(size > 1e-6)) {
        DisplayMode.setBase(0, 0, 0, 0, 0, 0, GUI_AREA_SCALE, GUI_AREA_SCALE, GUI_AREA_SCALE);
        return;
    }
    let factor = GUI_ITEM_SIZE / size;
    let centre = box.getCenter(new THREE.Vector3());
    let translation = DisplayMode.display_base.position;
    let scale = GUI_AREA_SCALE * factor;
    let offset = axis => GUI_AREA_SCALE * ((1 - factor) * translation[axis] - factor * centre[axis]);
    DisplayMode.setBase(offset('x'), offset('y'), offset('z'), 0, 0, 0, scale, scale, scale);
}

// =========================
// Wrapping updateDisplayBase
// =========================
function updateBedrockDisplayBase(original, args) {
    if (getRoute() !== 'block' || !Modes.display) return original.apply(this, args);
    let drawArgs = args;
    let slot = args[0] || (Project && Project.display_settings[DisplayMode.display_slot]);
    if (LEFT_HAND_PIVOT_MIRROR && slot && isLeftHandSlot(DisplayMode.display_slot)) {
        drawArgs = [mirrorPivotsForLeftHand(slot)];
    }
    let result = original.apply(this, drawArgs);
    let reference = displayReferenceObjects.active;
    let definition = getReferenceDefinition(reference);
    if (definition && definition.shelfCopies && reference.shelf_displays) updateShelfCopies(reference);
    if (DisplayMode.display_slot === 'gui') applyGuiDisplayArea();
    return result;
}

function mirrorPivotsForLeftHand(slot) {
    let shadow = Object.create(slot);
    shadow.rotation_pivot = [-slot.rotation_pivot[0], slot.rotation_pivot[1], slot.rotation_pivot[2]];
    shadow.scale_pivot = [-slot.scale_pivot[0], slot.scale_pivot[1], slot.scale_pivot[2]];
    return shadow;
}

// =========================
// GUI: face dimming
// =========================
let isFaceDimmingRemoved = false;

function shouldRemoveFaceDimming() {
    return previewOptions.faceDimming === false && !!Modes.display && getRoute() === 'block';
}

function getShadedMaterials() {
    let materials = [];
    let add = material => {
        if (material && material.uniforms && material.uniforms.SHADE) materials.push(material);
    };
    for (let texture of Texture.all) add(typeof texture.getMaterial === 'function' ? texture.getMaterial() : texture.material);
    (Canvas.emptyMaterials || []).forEach(add);
    (Canvas.coloredSolidMaterials || []).forEach(add);
    return materials;
}

function removeFaceDimming() {
    if (!shouldRemoveFaceDimming()) return;
    for (let material of getShadedMaterials()) material.uniforms.SHADE.value = false;
    isFaceDimmingRemoved = true;
}

function refreshFaceDimming() {
    if (shouldRemoveFaceDimming()) {
        removeFaceDimming();
    } else if (isFaceDimmingRemoved) {
        isFaceDimmingRemoved = false;
        Canvas.updateShading();
    }
}

function followFaceDimming() {
    let hooks = createDeletables([
        () => Blockbench.on('update_scene_shading', guardListener('update_scene_shading', removeFaceDimming)),
        () => Blockbench.on(SYNC_EVENTS, guardListener('face_dimming', refreshFaceDimming))
    ]);
    return {
        delete() {
            hooks.delete();
            if (isFaceDimmingRemoved) {
                isFaceDimmingRemoved = false;
                Canvas.updateShading();
            }
        }
    };
}

// =========================
// GUI overlays
// =========================
const GUI_OVERLAYS = [
    { referenceId: 'bedrock_gui_grid', nameKey: 'display_sensei.reference.bedrock_gui_grid', size: [3 * GUI_SLOT_SIZE, 3 * GUI_SLOT_SIZE], modelAt: [1.5 * GUI_SLOT_SIZE, 1.5 * GUI_SLOT_SIZE], draw: drawGridOverlay },
    {
        referenceId: 'bedrock_gui_inventory', nameKey: 'display_sensei.reference.bedrock_gui_inventory',
        size: [2 * INVENTORY_BORDER + 9 * GUI_SLOT_SIZE, 2 * INVENTORY_BORDER + 4 * GUI_SLOT_SIZE + INVENTORY_GAP],
        modelAt: [INVENTORY_BORDER + GUI_SLOT_SIZE / 2, INVENTORY_BORDER + 3 * GUI_SLOT_SIZE + INVENTORY_GAP + GUI_SLOT_SIZE / 2],
        draw: drawInventoryOverlay
    },
    {
        referenceId: 'bedrock_gui_hotbar', nameKey: 'display_sensei.reference.bedrock_gui_hotbar',
        size: [HOTBAR_SLOTS * HOTBAR_PITCH + 4, HOTBAR_SELECTION],
        modelAt: [2 + HOTBAR_SELECTED_SLOT * HOTBAR_PITCH + HOTBAR_PITCH / 2, HOTBAR_SELECTION / 2],
        draw: drawHotbarOverlay
    }
];

function createOverlayCanvas(size) {
    let canvas = document.createElement('canvas');
    canvas.width = size[0] * OVERLAY_DRAW_SCALE;
    canvas.height = size[1] * OVERLAY_DRAW_SCALE;
    let context = canvas.getContext('2d');
    let fill = (colour, x, y, width, height) => {
        context.fillStyle = colour;
        context.fillRect(x * OVERLAY_DRAW_SCALE, y * OVERLAY_DRAW_SCALE, width * OVERLAY_DRAW_SCALE, height * OVERLAY_DRAW_SCALE);
    };
    return { canvas, context, fill };
}

function drawSlot(fill, x, y) {
    let size = GUI_SLOT_SIZE;
    fill(GUI_COLOURS.slot, x, y, size, size);
    fill(GUI_COLOURS.shadow, x, y, size, 1);
    fill(GUI_COLOURS.shadow, x, y, 1, size);
    fill(GUI_COLOURS.highlight, x + 1, y + size - 1, size - 1, 1);
    fill(GUI_COLOURS.highlight, x + size - 1, y + 1, 1, size - 1);
}

function drawGridOverlay(fill) {
    for (let row = 0; row < 3; row++) {
        for (let column = 0; column < 3; column++) drawSlot(fill, column * GUI_SLOT_SIZE, row * GUI_SLOT_SIZE);
    }
}

function drawInventoryOverlay(fill, size) {
    fill(GUI_COLOURS.outline, 0, 0, size[0], size[1]);
    fill(GUI_COLOURS.panel, 1, 1, size[0] - 2, size[1] - 2);
    fill(GUI_COLOURS.highlight, 1, 1, size[0] - 3, 2);
    fill(GUI_COLOURS.highlight, 1, 1, 2, size[1] - 3);
    fill(GUI_COLOURS.shadow, 3, size[1] - 3, size[0] - 4, 2);
    fill(GUI_COLOURS.shadow, size[0] - 3, 3, 2, size[1] - 4);
    for (let row = 0; row < 4; row++) {
        let y = INVENTORY_BORDER + row * GUI_SLOT_SIZE + (row === 3 ? INVENTORY_GAP : 0);
        for (let column = 0; column < 9; column++) drawSlot(fill, INVENTORY_BORDER + column * GUI_SLOT_SIZE, y);
    }
}

function drawHotbarOverlay(fill, size) {
    let top = (size[1] - HOTBAR_HEIGHT) / 2;
    let left = 2;
    let width = HOTBAR_SLOTS * HOTBAR_PITCH;
    fill(GUI_COLOURS.outline, left - 1, top, width + 2, HOTBAR_HEIGHT);
    fill(GUI_COLOURS.hotbar, left, top + 1, width, HOTBAR_HEIGHT - 2);
    for (let slot = 0; slot < HOTBAR_SLOTS; slot++) {
        let x = left + slot * HOTBAR_PITCH;
        fill(GUI_COLOURS.hotbarSlot, x + 1, top + 1, HOTBAR_PITCH - 2, 1);
        fill(GUI_COLOURS.hotbarSlot, x + 1, top + HOTBAR_HEIGHT - 2, HOTBAR_PITCH - 2, 1);
        fill(GUI_COLOURS.hotbarSlot, x + 1, top + 1, 1, HOTBAR_HEIGHT - 2);
        fill(GUI_COLOURS.hotbarSlot, x + HOTBAR_PITCH - 2, top + 1, 1, HOTBAR_HEIGHT - 2);
    }
    let x = left + HOTBAR_SELECTED_SLOT * HOTBAR_PITCH + HOTBAR_PITCH / 2 - HOTBAR_SELECTION / 2;
    fill(GUI_COLOURS.outline, x, 0, HOTBAR_SELECTION, 1);
    fill(GUI_COLOURS.outline, x, HOTBAR_SELECTION - 1, HOTBAR_SELECTION, 1);
    fill(GUI_COLOURS.outline, x, 0, 1, HOTBAR_SELECTION);
    fill(GUI_COLOURS.outline, x + HOTBAR_SELECTION - 1, 0, 1, HOTBAR_SELECTION);
    fill(GUI_COLOURS.selection, x + 1, 1, HOTBAR_SELECTION - 2, 2);
    fill(GUI_COLOURS.selection, x + 1, HOTBAR_SELECTION - 3, HOTBAR_SELECTION - 2, 2);
    fill(GUI_COLOURS.selection, x + 1, 1, 2, HOTBAR_SELECTION - 2);
    fill(GUI_COLOURS.selection, x + HOTBAR_SELECTION - 3, 1, 2, HOTBAR_SELECTION - 2);
}

let guiOverlayImages = [];

function drawOverlaySource(overlay) {
    let { canvas, fill } = createOverlayCanvas(overlay.size);
    overlay.draw(fill, overlay.size);
    return canvas.toDataURL('image/png');
}

function getOverlayPosition(overlay) {
    return [
        (overlay.size[0] / 2 - overlay.modelAt[0]) * REFERENCE_IMAGE_UNITS_PER_PIXEL,
        (overlay.size[1] / 2 - overlay.modelAt[1]) * REFERENCE_IMAGE_UNITS_PER_PIXEL
    ];
}

function createGuiOverlays() {
    guiOverlayImages = GUI_OVERLAYS.map(overlay => {
        let image = new ReferenceImage({
            condition: () => !!Modes.display && getRoute() === 'block' &&
                !!displayReferenceObjects.active && displayReferenceObjects.active.id === overlay.referenceId,
            name: i18n(overlay.nameKey),
            source: drawOverlaySource(overlay),
            position: getOverlayPosition(overlay),
            size: overlay.size.map(value => value * REFERENCE_IMAGE_UNITS_PER_PIXEL),
            attached_side: 'south',
            layer: 'background',
            is_blueprint: true
        });
        image.ds_reference_id = overlay.referenceId;
        return image;
    });
    syncGuiOverlayRegistration();
    let listener = Blockbench.on(SYNC_EVENTS, guardListener('gui_overlays', syncGuiOverlayRegistration));
    return {
        delete() {
            listener.delete();
            for (let image of guiOverlayImages) {
                if (image.scope === 'built_in') {
                    if (!ReferenceImage.built_in.includes(image)) ReferenceImage.built_in.push(image);
                    image.delete(true);
                } else {
                    image.removed = true;
                }
            }
            guiOverlayImages = [];
            ReferenceImage.updateAll();
        }
    };
}

function syncGuiOverlayRegistration() {
    let wanted = getRoute() === 'block';
    for (let image of guiOverlayImages) {
        let listed = ReferenceImage.built_in.includes(image);
        if (wanted && !listed) {
            image.addAsBuiltIn();
        } else if (!wanted && listed) {
            ReferenceImage.built_in.remove(image);
            image.update();
        }
    }
}

// =========================
// Glow item frame texture
// =========================
let glowFrameTexture = null;

function getBlockbenchFrameTexturePath() {
    let models = cloneBlockbenchModels('frame');
    let board = models.find(model => isFrameBoardTexture(model.texture));
    return board ? board.texture : FALLBACK_FRAME_TEXTURE;
}

function createGlowFrameTexture() {
    let image = new Image();
    let cancelled = false;
    image.onload = () => {
        if (cancelled) return;
        let canvas = document.createElement('canvas');
        canvas.width = image.naturalWidth;
        canvas.height = image.naturalHeight;
        let context = canvas.getContext('2d');
        context.drawImage(image, 0, 0);
        context.globalCompositeOperation = 'source-atop';
        context.fillStyle = GLOW_FRAME_TINT;
        context.fillRect(0, 0, canvas.width, canvas.height);
        glowFrameTexture = canvas.toDataURL('image/png');
        Object.values(bedrockReferences).forEach(applyGlowTextureTo);
    };
    image.onerror = () => {
        if (!cancelled) console.warn(LOG_PREFIX, 'Could not read Blockbench\'s item frame texture for the glow item frame.');
    };
    image.src = getBlockbenchFrameTexturePath();
    return {
        delete() {
            cancelled = true;
            image.onload = image.onerror = null;
            glowFrameTexture = null;
        }
    };
}

function applyGlowTextureTo(reference) {
    let definition = getReferenceDefinition(reference);
    if (!definition || !definition.glow || !glowFrameTexture) return;
    for (let model of reference.models) {
        if (isFrameBoardTexture(model.texture)) model.texture = glowFrameTexture;
    }
    reference.model.traverse(object => {
        let map = object.isMesh && object.material && object.material.map;
        if (map && map.image && isFrameBoardTexture(map.image.src) && !map.image.src.startsWith('data:')) {
            map.image.addEventListener('load', () => { map.needsUpdate = true; }, { once: true });
            map.image.src = glowFrameTexture;
        }
    });
}

// =========================
// Skin variant
// =========================
function followPlayerVariant() {
    let player = displayReferenceObjects.refmodels.player;
    if (!player || typeof player.setModelVariant !== 'function') return { delete() {} };
    let hadOwn = Object.prototype.hasOwnProperty.call(player, 'setModelVariant');
    let original = player.setModelVariant;
    let active = true;
    let wrapper = function(variant) {
        let result = original.apply(this, arguments);
        let bedrock = getBedrockReference('bedrock_player');
        if (active && bedrock && bedrock.ds_prepared) {
            bedrock.constructor.prototype.setModelVariant.call(bedrock, variant);
        }
        return result;
    };
    player.setModelVariant = wrapper;
    return {
        delete() {
            active = false;
            if (player.setModelVariant !== wrapper) return;
            if (hadOwn) player.setModelVariant = original;
            else delete player.setModelVariant;
        }
    };
}

// =========================
// Options (preview only)
// =========================
function getActiveBedrockReference(slotId) {
    if (!isShowingSlot(slotId)) return null;
    let reference = displayReferenceObjects.active;
    return getReferenceDefinition(reference) ? reference : null;
}

function buildArmPoseOption(slotId) {
    let left = isLeftHandSlot(slotId);
    return {
        id: 'arm_pose',
        label: i18n('display_sensei.reference_option.arm_pose'),
        kind: 'select',
        value: getArmPose(slotId).id,
        choices: ARM_POSES.filter(pose => !left || pose.leftHand).map(pose => ({ id: pose.id, label: i18n(pose.labelKey) })),
        hint: i18n('display_sensei.reference_option.arm_pose_hint')
    };
}

function buildStandPoseOption() {
    return {
        id: 'stand_pose',
        label: i18n('display_sensei.reference_option.stand_pose'),
        kind: 'select',
        value: getStandPose(previewOptions.standPose).id,
        choices: STAND_POSES.map(pose => ({ id: pose.id, label: i18n(pose.labelKey) })),
        hint: i18n('display_sensei.reference_option.stand_pose_hint')
    };
}

function buildFrameRotationOption() {
    let choices = [];
    for (let step = 0; step < FRAME_ROTATION_STEPS; step++) {
        let degrees = step * FRAME_ROTATION_STEP;
        choices.push({ id: degrees, label: i18nFormat('display_sensei.frame_rotation.step', { deg: degrees }) });
    }
    return {
        id: 'frame_rotation',
        label: i18n('display_sensei.reference_option.frame_rotation'),
        kind: 'select',
        value: getFrameRotation(),
        choices,
        hint: i18n('display_sensei.reference_option.frame_rotation_hint')
    };
}

function buildFaceDimmingOption() {
    return {
        id: 'face_dimming',
        label: i18n('display_sensei.reference_option.face_dimming'),
        kind: 'toggle',
        value: previewOptions.faceDimming,
        hint: i18n('display_sensei.reference_option.face_dimming_hint')
    };
}

function buildFitPreviewOption() {
    return {
        id: 'fit_preview',
        label: i18n('display_sensei.reference_option.fit_preview'),
        kind: 'toggle',
        value: previewOptions.fitPreview,
        hint: i18n('display_sensei.reference_option.fit_preview_hint')
    };
}

function getReferenceOptions(slotId) {
    if (!isShowingSlot(slotId)) return null;
    let reference = getActiveBedrockReference(slotId);
    let kind = reference ? reference.ds_definition.kind : null;
    let options = [];
    if (kind === 'player' && THIRD_PERSON_SLOTS.includes(slotId)) options.push(buildArmPoseOption(slotId));
    if (kind === 'armor_stand_posed' && HOLDER_SLOTS.includes(slotId)) options.push(buildStandPoseOption());
    if (reference && reference.ds_definition.frame) options.push(buildFrameRotationOption());
    if (slotId === 'gui') {
        options.push(buildFaceDimmingOption());
        if (getProjectData().gui_fit_to_frame) options.push(buildFitPreviewOption());
    }
    return options.length ? options : null;
}

function findChoice(option, value) {
    let choice = option.choices.find(entry => String(entry.id) === String(value));
    if (!choice && option.id === 'stand_pose' && Number.isInteger(value)) choice = option.choices[value];
    return choice || null;
}

function setReferenceOption(slotId, optionId, value) {
    let options = getReferenceOptions(slotId) || [];
    let option = options.find(entry => entry.id === optionId);
    if (!option) return false;
    let reference = displayReferenceObjects.active;
    if (option.kind === 'select') {
        let choice = findChoice(option, value);
        if (!choice) return false;
        if (optionId === 'arm_pose') previewOptions.armPose[slotId] = choice.id;
        if (optionId === 'stand_pose') previewOptions.standPose = STAND_POSES.findIndex(pose => pose.id === choice.id);
        if (optionId === 'frame_rotation') previewOptions.frameStep = Number(choice.id) / FRAME_ROTATION_STEP;
        reference.updateBasePosition();
        syncBlockbenchPoseSlider(reference);
        if (optionId !== 'frame_rotation') aimThirdPersonCamera();
        return true;
    }
    if (typeof value !== 'boolean') return false;
    if (optionId === 'face_dimming') {
        previewOptions.faceDimming = value;
        refreshFaceDimming();
    }
    if (optionId === 'fit_preview') {
        previewOptions.fitPreview = value;
        applyGuiDisplayArea();
    }
    return true;
}

function canOpenSkinDialog() {
    let reference = displayReferenceObjects.active;
    return !!Modes.display && getRoute() === 'block' && !!reference && reference.id === 'bedrock_player' &&
        typeof changeDisplaySkin === 'function';
}

function openSkinDialog() {
    if (!canOpenSkinDialog()) return false;
    changeDisplaySkin();
    return true;
}

const SKIN_MENU_ENTRY_NAME = 'settings.display_skin';

function followSkinMenuEntry() {
    let menu = typeof Preview === 'function' && Preview.prototype ? Preview.prototype.menu : null;
    let structure = menu && Array.isArray(menu.structure) ? menu.structure : [];
    let entry = structure.find(item => isPlainObject(item) && item.name === SKIN_MENU_ENTRY_NAME);
    if (!entry || typeof entry.condition !== 'function') return { delete() {} };
    let original = entry.condition;
    let condition = function(...args) {
        if (getRoute() === 'block' && Modes.display && canOpenSkinDialog()) return true;
        return original.apply(this, args);
    };
    entry.condition = condition;
    return {
        delete() {
            if (entry.condition === condition) entry.condition = original;
        }
    };
}

// =========================
// Statue preset (used by bedrock_spec.js and block_route.js)
// =========================
const STATUE_CENTRE = [0, 8, 0];

function getStatueHandAreas(poseId) {
    let pose = STAND_POSES.find(entry => entry.id === poseId);
    if (!pose) return null;
    let parents = [{ pivot: STAND_BODY_PIVOT, rot: pose.body }];
    let areas = {};
    for (let slotId of THIRD_PERSON_SLOTS) {
        let left = isLeftHandSlot(slotId);
        let rig = THIRD_PERSON_RIGS.armor_stand[left ? 'left' : 'right'];
        let frame = composeHeldItemFrame(Object.assign({}, rig, { armRot: left ? pose.leftarm : pose.rightarm, parents }));
        let drawn = frame.clone().invert().multiply(translationMatrix(STATUE_CENTRE));
        let args = toSetBaseArgs(drawn);
        if (left) args = mirrorSetBaseArgs(args);
        areas[slotId] = {
            rotation: args.slice(3, 6).map(roundToFour),
            translation: args.slice(0, 3).map(roundToFour),
            scale: [1, 1, 1]
        };
    }
    return areas;
}

// =========================
// Install
// =========================
function installBedrockReferences() {
    let ReferenceClass = findReferenceClass();
    if (!ReferenceClass) {
        console.warn(LOG_PREFIX, 'Blockbench\'s reference model class was not found; the Bedrock reference models are not available.');
        return { delete() {} };
    }
    previewOptions = createPreviewOptions();
    let hooks = createDeletables([
        createGlowFrameTexture,
        () => registerBedrockReferences(ReferenceClass),
        splitRememberedReferences,
        wrapBedrockReferenceBar,
        createGuiOverlays,
        () => wrapMethod(DisplayMode, 'groundAnimation', animateBedrockGround),
        () => wrapMethod(DisplayMode, 'updateDisplayBase', updateBedrockDisplayBase),
        followFaceDimming,
        followPlayerVariant,
        followGroundRestHeight,
        followSkinMenuEntry
    ]);
    try {
        showBedrockReferencesNow();
    } catch (error) {
        console.warn(LOG_PREFIX, 'Could not show the Bedrock reference models:', error);
    }
    return {
        delete() {
            let slotId = Modes.display ? DisplayMode.display_slot : null;
            let blockbenchIds = slotId ? getBlockbenchIdsForSlot(slotId) : [];
            if (getReferenceDefinition(displayReferenceObjects.active)) displayReferenceObjects.clear();
            hooks.delete();
            blockbenchIdsBySlot = {};
            unmappedBlockbenchIds = new Set();
            savedSlotCamera = null;
            resetGroundClock();
            if (slotId) showBlockbenchReferencesAgain(slotId, blockbenchIds);
        }
    };
}

registerModuleInstaller('bedrock_references', installBedrockReferences);

// ---- src/hand_views.js ----

// =========================
// Other hand views (block route)
// =========================
const HAND_VIEW_SUBTABS = ['first_person', 'third_back', 'third_front'];

const MAX_HAND_VIEW_SIZE = 1024;

const HAND_VIEW_SAMPLES = 4;

function getHandViewChoices() {
    let active = getActiveContext();
    if (!active || !active.handId || !HAND_VIEW_SUBTABS.includes(active.subtabId) || !getDisplayPreview()) return null;
    return HAND_VIEW_SUBTABS
        .filter(subtabId => subtabId !== active.subtabId)
        .map(subtabId => {
            let view = findContextView(subtabId, active.handId);
            return { subtabId, handId: active.handId, slotId: view.slotId };
        });
}

// =========================
// Switching the scene for one snapshot
// =========================
function saveTransform(object) {
    return { position: object.position.clone(), rotation: object.rotation.clone(), scale: object.scale.clone() };
}

function restoreTransform(object, saved) {
    object.position.copy(saved.position);
    object.rotation.copy(saved.rotation);
    object.scale.copy(saved.scale);
}

let isHandViewSceneShown = false;

function isDrawingHandView() {
    return isHandViewSceneShown;
}

function withHandViewScene(view, reference, render) {
    isHandViewSceneShown = true;
    try {
        return switchToHandViewScene(view, reference, render);
    } finally {
        isHandViewSceneShown = false;
    }
}

function switchToHandViewScene(view, reference, render) {
    let scene = Canvas.scene;
    let area = DisplayMode.display_area;
    let base = DisplayMode.display_base;
    let shownSlotId = DisplayMode.display_slot;
    let active = displayReferenceObjects.active;
    let swapped = reference !== active;
    let savedArea = saveTransform(area);
    let savedBase = saveTransform(base);
    let others = area.children.filter(child => child !== base && child.visible);
    let gizmoVisible = Transformer.visible;
    try {
        DisplayMode.display_slot = view.slotId;
        displayReferenceObjects.active = reference;
        let slot = ensureSlot(view.slotId);
        if (swapped) {
            if (active) scene.remove(active.model);
            scene.add(reference.model);
        }
        placeReferenceForSlot(reference);
        DisplayMode.updateDisplayBase(slot);
        others.forEach(child => {
            child.visible = false;
        });
        Transformer.visible = false;
        area.updateMatrixWorld(true);
        return render();
    } finally {
        DisplayMode.display_slot = shownSlotId;
        displayReferenceObjects.active = active;
        if (swapped) {
            scene.remove(reference.model);
            if (active) scene.add(active.model);
        } else if (view.slotId !== shownSlotId) {
            placeReferenceForSlot(active);
        }
        others.forEach(child => {
            child.visible = true;
        });
        restoreTransform(area, savedArea);
        restoreTransform(base, savedBase);
        area.updateMatrixWorld(true);
        Transformer.visible = gizmoVisible;
        Transformer.center();
    }
}

// =========================
// Rendering
// =========================
let handViewCamera = null;
let handViewTarget = null;

function getHandViewTarget(renderer, width, height) {
    if (handViewTarget && (handViewTarget.width !== width || handViewTarget.height !== height)) {
        handViewTarget.dispose();
        handViewTarget = null;
    }
    if (!handViewTarget) {
        handViewTarget = new THREE.WebGLRenderTarget(width, height);
        let webgl2 = !renderer.capabilities || renderer.capabilities.isWebGL2 !== false;
        if (webgl2 && 'samples' in handViewTarget) handViewTarget.samples = HAND_VIEW_SAMPLES;
        if ('outputColorSpace' in renderer && 'colorSpace' in handViewTarget.texture) handViewTarget.texture.colorSpace = renderer.outputColorSpace;
        else if ('outputEncoding' in renderer && 'encoding' in handViewTarget.texture) handViewTarget.texture.encoding = renderer.outputEncoding;
    }
    return handViewTarget;
}

function aimHandViewCamera(preview, view, reference, aspect) {
    if (!handViewCamera) handViewCamera = preview.camPers.clone(false);
    let camera = handViewCamera;
    camera.copy(preview.camPers, false);
    camera.zoom = 1;
    camera.aspect = aspect;
    let placement = getHandViewCamera(view, aspect, reference);
    let target = new THREE.Vector3().fromArray(placement.target);
    let position = new THREE.Vector3().fromArray(placement.position);
    if (placement.focalLength) {
        camera.setFocalLength(placement.focalLength);
    } else {
        camera.fov = placement.fov;
    }
    camera.position.copy(position);
    camera.up.set(0, 1, 0);
    camera.lookAt(target);
    camera.updateProjectionMatrix();
    camera.updateMatrixWorld(true);
    return camera;
}

let handViewPixels = null;

function readHandViewPixels(renderer, target, width, height) {
    if (!handViewPixels || handViewPixels.length !== width * height * 4) handViewPixels = new Uint8Array(width * height * 4);
    let pixels = handViewPixels;
    renderer.readRenderTargetPixels(target, 0, 0, width, height, pixels);
    let image = new ImageData(width, height);
    let rowLength = width * 4;
    for (let row = 0; row < height; row++) {
        let from = (height - 1 - row) * rowLength;
        let to = row * rowLength;
        for (let index = 0; index < rowLength; index += 4) {
            let alpha = pixels[from + index + 3];
            let scale = alpha > 0 && alpha < 255 ? 255 / alpha : 1;
            image.data[to + index] = Math.min(255, pixels[from + index] * scale);
            image.data[to + index + 1] = Math.min(255, pixels[from + index + 1] * scale);
            image.data[to + index + 2] = Math.min(255, pixels[from + index + 2] * scale);
            image.data[to + index + 3] = alpha;
        }
    }
    return image;
}

function drawHandView(preview, view, reference, width, height) {
    let renderer = preview.renderer;
    let camera = aimHandViewCamera(preview, view, reference, width / height);
    let target = getHandViewTarget(renderer, width, height);
    let previousTarget = renderer.getRenderTarget();
    try {
        renderer.setRenderTarget(target);
        renderer.clear();
        renderer.render(Canvas.scene, camera);
    } finally {
        renderer.setRenderTarget(previousTarget);
    }
    return readHandViewPixels(renderer, target, width, height);
}

let handViewStats = { renders: 0, lastMs: 0, totalMs: 0, maxMs: 0 };

function getHandViewStats() {
    let stats = handViewStats;
    return { renders: stats.renders, lastMs: stats.lastMs, averageMs: stats.renders ? stats.totalMs / stats.renders : 0, maxMs: stats.maxMs };
}

function renderHandView(subtabId, handId, width, height) {
    let view = findContextView(subtabId, handId);
    let preview = getDisplayPreview();
    let size = [Math.round(width), Math.round(height)];
    if (getRoute() !== 'block' || !Project || !Modes.display || !view || !view.handId || !preview || !preview.renderer) return null;
    if (!size.every(value => Number.isFinite(value) && value >= 1 && value <= MAX_HAND_VIEW_SIZE)) return null;
    if (Transformer.dragging) return null;
    let started = performance.now();
    let image;
    try {
        let reference = getSlotReference(view.slotId);
        if (!reference) return null;
        image = withHandViewScene(view, reference, () => drawHandView(preview, view, reference, size[0], size[1]));
    } catch (error) {
        console.warn(LOG_PREFIX, 'Could not draw the hand view:', error);
        return null;
    }
    let took = performance.now() - started;
    handViewStats.renders++;
    handViewStats.lastMs = took;
    handViewStats.totalMs += took;
    handViewStats.maxMs = Math.max(handViewStats.maxMs, took);
    return image;
}

// =========================
// Install
// =========================
function installHandViews() {
    handViewStats = { renders: 0, lastMs: 0, totalMs: 0, maxMs: 0 };
    return {
        delete() {
            if (handViewTarget) handViewTarget.dispose();
            handViewTarget = null;
            handViewCamera = null;
            handViewPixels = null;
        }
    };
}

registerModuleInstaller('hand_views', installHandViews);

// ---- src/armor_spec.js ----

// =========================
// Armor data (Armor tab)
// =========================

// =========================
// Wear slots
// =========================
const WEAR_SLOTS = [
    {
        id: 'slot.armor.head', label: 'display_sensei.subtab.armor_head', info: 'display_sensei.info.armor_head',
        wearableSlot: 'slot.armor.head', enchantableSlot: 'armor_head',
        layerVariable: 'variable.helmet_layer_visible',
        bones: ['head', 'hat'], flatPiece: 'helmet', displaySlot: 'head',
        support: { block: 'edit', attachable: 'armor', entity: 'mob' }
    },
    {
        id: 'slot.armor.chest', label: 'display_sensei.subtab.armor_chest', info: 'display_sensei.info.armor_chest',
        wearableSlot: 'slot.armor.chest', enchantableSlot: 'armor_torso',
        layerVariable: 'variable.chest_layer_visible',
        bones: ['body', 'rightArm', 'leftArm'], flatPiece: 'chestplate', displaySlot: null,
        support: { block: 'worn_body', attachable: 'armor', entity: 'mob' }
    },
    {
        id: 'slot.armor.legs', label: 'display_sensei.subtab.armor_legs', info: 'display_sensei.info.armor_legs',
        wearableSlot: 'slot.armor.legs', enchantableSlot: 'armor_legs',
        layerVariable: 'variable.leg_layer_visible',
        bones: ['body', 'rightLeg', 'leftLeg'], flatPiece: 'leggings', displaySlot: null,
        support: { block: 'worn_body', attachable: 'armor', entity: 'mob' }
    },
    {
        id: 'slot.armor.feet', label: 'display_sensei.subtab.armor_feet', info: 'display_sensei.info.armor_feet',
        wearableSlot: 'slot.armor.feet', enchantableSlot: 'armor_feet',
        layerVariable: 'variable.boot_layer_visible',
        bones: ['rightLeg', 'leftLeg'], flatPiece: 'boots', displaySlot: null,
        support: { block: 'worn_body', attachable: 'armor', entity: 'mob' }
    },
    {
        id: 'slot.weapon.offhand', label: 'display_sensei.subtab.armor_offhand', info: 'display_sensei.info.armor_offhand',
        wearableSlot: 'slot.weapon.offhand', enchantableSlot: null,
        layerVariable: null,
        bones: ['leftItem'], flatPiece: null, displaySlot: null,
        support: { block: 'offhand_pointer', attachable: 'offhand_pointer', entity: 'mob' }
    }
];

function findWearSlot(id) {
    return WEAR_SLOTS.find(slot => slot.id === id) || null;
}

const WEARER_BONE_NAMES = ['head', 'hat', 'body', 'rightArm', 'leftArm', 'rightLeg', 'leftLeg', 'leftItem'];

// =========================
// Table helpers
// =========================
function vanillaBone(pivot, parent, cubes = [], extras = {}) {
    return Object.assign({ pivot, parent, cubes }, extras);
}

function vanillaCube(origin, size, uv, inflate = 0, extras = {}) {
    return Object.assign({ origin, size, inflate, uv }, extras);
}

function freezeArmorData(value) {
    if (value && typeof value === 'object' && !Object.isFrozen(value)) {
        Object.freeze(value);
        for (let key of Object.keys(value)) freezeArmorData(value[key]);
    }
    return value;
}

// =========================
// Wearers: bone tables
// =========================
const PLAYER_WIDE_BONES = {
    root: vanillaBone([0, 0, 0], null),
    body: vanillaBone([0, 24, 0], 'waist', [vanillaCube([-4, 12, -2], [8, 12, 4], [16, 16])]),
    waist: vanillaBone([0, 12, 0], 'root'),
    head: vanillaBone([0, 24, 0], 'body', [vanillaCube([-4, 24, -4], [8, 8, 8], [0, 0])]),
    cape: vanillaBone([0, 24, 3], 'body'),
    hat: vanillaBone([0, 24, 0], 'head', [vanillaCube([-4, 24, -4], [8, 8, 8], [32, 0], 0.5, { layer: true })]),
    leftArm: vanillaBone([5, 22, 0], 'body', [vanillaCube([4, 12, -2], [4, 12, 4], [32, 48])]),
    leftSleeve: vanillaBone([5, 22, 0], 'leftArm', [vanillaCube([4, 12, -2], [4, 12, 4], [48, 48], 0.25, { layer: true })]),
    leftItem: vanillaBone([6, 15, 1], 'leftArm'),
    rightArm: vanillaBone([-5, 22, 0], 'body', [vanillaCube([-8, 12, -2], [4, 12, 4], [40, 16])]),
    rightSleeve: vanillaBone([-5, 22, 0], 'rightArm', [vanillaCube([-8, 12, -2], [4, 12, 4], [40, 32], 0.25, { layer: true })]),
    rightItem: vanillaBone([-6, 15, 1], 'rightArm'),
    leftLeg: vanillaBone([1.9, 12, 0], 'root', [vanillaCube([-0.1, 0, -2], [4, 12, 4], [16, 48])]),
    leftPants: vanillaBone([1.9, 12, 0], 'leftLeg', [vanillaCube([-0.1, 0, -2], [4, 12, 4], [0, 48], 0.25, { layer: true })]),
    rightLeg: vanillaBone([-1.9, 12, 0], 'root', [vanillaCube([-3.9, 0, -2], [4, 12, 4], [0, 16])]),
    rightPants: vanillaBone([-1.9, 12, 0], 'rightLeg', [vanillaCube([-3.9, 0, -2], [4, 12, 4], [0, 32], 0.25, { layer: true })]),
    jacket: vanillaBone([0, 24, 0], 'body', [vanillaCube([-4, 12, -2], [8, 12, 4], [16, 32], 0.25, { layer: true })])
};

const PLAYER_SLIM_BONES = {
    root: vanillaBone([0, 0, 0], null),
    waist: vanillaBone([0, 12, 0], 'root'),
    body: vanillaBone([0, 24, 0], 'waist', [vanillaCube([-4, 12, -2], [8, 12, 4], [16, 16])]),
    head: vanillaBone([0, 24, 0], 'body', [vanillaCube([-4, 24, -4], [8, 8, 8], [0, 0])]),
    hat: vanillaBone([0, 24, 0], 'head', [vanillaCube([-4, 24, -4], [8, 8, 8], [32, 0], 0.5, { layer: true })]),
    rightLeg: vanillaBone([-1.9, 12, 0], 'root', [vanillaCube([-3.9, 0, -2], [4, 12, 4], [0, 16])]),
    rightPants: vanillaBone([-1.9, 12, 0], 'rightLeg', [vanillaCube([-3.9, 0, -2], [4, 12, 4], [0, 32], 0.25, { layer: true })]),
    leftLeg: vanillaBone([1.9, 12, 0], 'root', [vanillaCube([-0.1, 0, -2], [4, 12, 4], [16, 48], 0, { mirror: true })]),
    leftPants: vanillaBone([1.9, 12, 0], 'leftLeg', [vanillaCube([-0.1, 0, -2], [4, 12, 4], [0, 48], 0.25, { layer: true })]),
    leftArm: vanillaBone([5, 21.5, 0], 'body', [vanillaCube([4, 11.5, -2], [3, 12, 4], [32, 48])]),
    leftSleeve: vanillaBone([5, 21.5, 0], 'leftArm', [vanillaCube([4, 11.5, -2], [3, 12, 4], [48, 48], 0.25, { layer: true })]),
    leftItem: vanillaBone([6, 14.5, 1], 'leftArm'),
    rightArm: vanillaBone([-5, 21.5, 0], 'body', [vanillaCube([-7, 11.5, -2], [3, 12, 4], [40, 16])]),
    rightSleeve: vanillaBone([-5, 21.5, 0], 'rightArm', [vanillaCube([-7, 11.5, -2], [3, 12, 4], [40, 32], 0.25, { layer: true })]),
    rightItem: vanillaBone([-6, 14.5, 1], 'rightArm'),
    jacket: vanillaBone([0, 24, 0], 'body', [vanillaCube([-4, 12, -2], [8, 12, 4], [16, 32], 0.25, { layer: true })]),
    cape: vanillaBone([0, 24, -3], 'body')
};

const ARMOR_STAND_BONES = {
    baseplate: vanillaBone([0, 0, 0], null, [vanillaCube([-6, 0, -6], [12, 1, 12], [0, 32])]),
    waist: vanillaBone([0, 12, 0], 'baseplate'),
    body: vanillaBone([0, 24, 0], 'waist', [
        vanillaCube([-6, 21, -1.5], [12, 3, 3], [0, 26]),
        vanillaCube([-3, 14, -1], [2, 7, 2], [16, 0]),
        vanillaCube([1, 14, -1], [2, 7, 2], [48, 16]),
        vanillaCube([-4, 12, -1], [8, 2, 2], [0, 48])
    ]),
    head: vanillaBone([0, 24, 0], 'body', [vanillaCube([-1, 24, -1], [2, 7, 2], [0, 0])]),
    hat: vanillaBone([0, 24, 0], 'head', [vanillaCube([-4, 24, -4], [8, 8, 8], [32, 0])]),
    leftarm: vanillaBone([5, 22, 0], 'body', [vanillaCube([5, 12, -1], [2, 12, 2], [32, 16], 0, { mirror: true })]),
    leftitem: vanillaBone([6, 15, 1], 'leftarm'),
    leftleg: vanillaBone([1.9, 12, 0], 'body', [vanillaCube([0.9, 1, -1], [2, 11, 2], [40, 16], 0, { mirror: true })]),
    rightarm: vanillaBone([-5, 22, 0], 'body', [vanillaCube([-7, 12, -1], [2, 12, 2], [24, 0])]),
    rightitem: vanillaBone([-6, 15, 1], 'rightarm'),
    rightleg: vanillaBone([-1.9, 12, 0], 'body', [vanillaCube([-2.9, 1, -1], [2, 11, 2], [8, 0])])
};

const ZOMBIE_BONES = {
    body: vanillaBone([0, 24, 0], 'waist', [vanillaCube([-4, 12, -2], [8, 12, 4], [16, 16])]),
    waist: vanillaBone([0, 12, 0], null, [], { neverRender: true }),
    head: vanillaBone([0, 24, 0], 'body', [vanillaCube([-4, 24, -4], [8, 8, 8], [0, 0])]),
    hat: vanillaBone([0, 24, 0], 'head', [vanillaCube([-4, 24, -4], [8, 8, 8], [32, 0], 0.5)], { neverRender: true }),
    rightArm: vanillaBone([-5, 22, 0], 'body', [vanillaCube([-8, 12, -2], [4, 12, 4], [40, 16])]),
    rightItem: vanillaBone([-6, 15, 1], 'rightArm', [], { neverRender: true }),
    leftArm: vanillaBone([5, 22, 0], 'body', [vanillaCube([4, 12, -2], [4, 12, 4], [40, 16], 0, { mirror: true })]),
    leftItem: vanillaBone([6, 15, 1], 'leftArm', [], { neverRender: true }),
    rightLeg: vanillaBone([-1.9, 12, 0], 'body', [vanillaCube([-3.9, 0, -2], [4, 12, 4], [0, 16])]),
    leftLeg: vanillaBone([1.9, 12, 0], 'body', [vanillaCube([-0.1, 0, -2], [4, 12, 4], [0, 16], 0, { mirror: true })])
};

const DROWNED_BONES = {
    body: vanillaBone([0, 24, 0], null, [vanillaCube([-4, 12, -2], [8, 12, 4], [16, 16])]),
    jacket: vanillaBone([0, 24, 0], 'body', [vanillaCube([-4, 12, -2], [8, 12, 4], [16, 32], 0.5, { layer: true })]),
    head: vanillaBone([0, 24, 0], 'body', [vanillaCube([-4, 24, -4], [8, 8, 8], [0, 0], 0.5)]),
    hat: vanillaBone([0, 24, 0], 'head', [vanillaCube([-4, 24, -4], [8, 8, 8], [32, 0], 1.0, { layer: true })]),
    rightArm: vanillaBone([-5, 22, 0], 'body', [vanillaCube([-8, 12, -2], [4, 12, 4], [0, 16])]),
    rightSleeve: vanillaBone([-5, 22, 0], 'rightArm', [vanillaCube([-8, 12, -2], [4, 12, 4], [48, 48], 0.5, { layer: true })]),
    rightItem: vanillaBone([-6, 15, 1], 'rightArm'),
    leftArm: vanillaBone([5, 22, 0], 'body', [vanillaCube([4, 12, -2], [4, 12, 4], [40, 16], 0, { mirror: true })]),
    leftSleeve: vanillaBone([5, 22, 0], 'leftArm', [vanillaCube([4, 12, -2], [4, 12, 4], [40, 32], 0.5, { mirror: true, layer: true })]),
    leftItem: vanillaBone([6, 15, 1], 'leftArm'),
    rightLeg: vanillaBone([-1.9, 12, 0], 'body', [vanillaCube([-4.05, 0, -2], [4, 12, 4], [16, 48])]),
    rightPants: vanillaBone([-1.9, 12, 0], 'rightLeg', [vanillaCube([-4.25, 0, -2], [4, 12, 4], [0, 48], 0.25, { layer: true })]),
    leftLeg: vanillaBone([1.9, 12, 0], 'body', [vanillaCube([0.05, 0, -2], [4, 12, 4], [32, 48], 0, { mirror: true })]),
    leftPants: vanillaBone([1.9, 12, 0], 'leftLeg', [vanillaCube([0.25, 0, -2], [4, 12, 4], [0, 32], 0.25, { mirror: true, layer: true })]),
    waist: vanillaBone([0, 12, 0], 'body')
};

const SKELETON_BONES = {
    body: vanillaBone([0, 24, 0], 'waist', [vanillaCube([-4, 12, -2], [8, 12, 4], [16, 16])]),
    waist: vanillaBone([0, 12, 0], null),
    head: vanillaBone([0, 24, 0], 'body', [vanillaCube([-4, 24, -4], [8, 8, 8], [0, 0])]),
    hat: vanillaBone([0, 24, 0], 'head', [vanillaCube([-4, 24, -4], [8, 8, 8], [32, 0], 0.5)], { neverRender: true }),
    rightArm: vanillaBone([-5, 22, 0], 'body', [vanillaCube([-6, 12, -1], [2, 12, 2], [40, 16])]),
    rightItem: vanillaBone([-6, 15, 1], 'rightArm', [], { neverRender: true }),
    leftArm: vanillaBone([5, 22, 0], 'body', [vanillaCube([4, 12, -1], [2, 12, 2], [40, 16], 0, { mirror: true })]),
    leftItem: vanillaBone([6, 15, 1], 'leftArm', [], { neverRender: true }),
    rightLeg: vanillaBone([-2, 12, 0], 'body', [vanillaCube([-3, 0, -1], [2, 12, 2], [0, 16])]),
    leftLeg: vanillaBone([2, 12, 0], 'body', [vanillaCube([1, 0, -1], [2, 12, 2], [0, 16], 0, { mirror: true })])
};

const WITHER_SKELETON_BONES = Object.assign({}, SKELETON_BONES, {
    rightItem: vanillaBone([-5, 15, 1], 'rightArm', [], { neverRender: true })
});

const BOGGED_BONES = {
    waist: vanillaBone([0, 12, 0], null),
    body: vanillaBone([0, 24, 0], 'waist', [vanillaCube([-4, 12, -2], [8, 12, 4], [16, 16])]),
    head: vanillaBone([0, 24, 0], 'body', [vanillaCube([-4, 24, -4], [8, 8, 8], [0, 0])]),
    mushrooms: vanillaBone([3, 31.5, 3], 'head', [
        vanillaCube([-6, 31, -3], [6, 4, 0], [50, 22], 0, { pivot: [-3, 32.5, -3], rotation: [0, -45, 0] }),
        vanillaCube([-6, 31, -3], [6, 4, 0], [50, 22], 0, { pivot: [-3, 32.5, -3], rotation: [0, 45, 0] }),
        vanillaCube([0, 31, 3], [6, 4, 0], [50, 16], 0, { pivot: [3, 31.5, 3], rotation: [0, 45, 0] }),
        vanillaCube([0, 31, 3], [6, 4, 0], [50, 16], 0, { pivot: [3, 31.5, 3], rotation: [0, -45, 0] }),
        vanillaCube([-5, 25, 3], [6, 5, 0], [50, 27], 0, { pivot: [-2, 25, 3], rotation: [-90, 0, 45] }),
        vanillaCube([-5, 25, 3], [6, 5, 0], [50, 27], 0, { pivot: [-2, 25, 3], rotation: [-90, 0, 135] })
    ]),
    hat: vanillaBone([0, 24, 0], 'head', [vanillaCube([-4, 24, -4], [8, 8, 8], [32, 0], 0.2, { layer: true })]),
    rightArm: vanillaBone([-5, 22, 0], 'body', [vanillaCube([-6, 12, -1], [2, 12, 2], [40, 16])]),
    rightItem: vanillaBone([-6, 15, 1], 'rightArm'),
    leftArm: vanillaBone([5, 22, 0], 'body', [vanillaCube([4, 12, -1], [2, 12, 2], [40, 16], 0, { mirror: true })]),
    leftItem: vanillaBone([6, 15, 1], 'leftArm'),
    rightLeg: vanillaBone([-2, 12, 0], 'body', [vanillaCube([-3, 0, -1], [2, 12, 2], [0, 16])]),
    leftLeg: vanillaBone([2, 12, 0], 'body', [vanillaCube([1, 0, -1], [2, 12, 2], [0, 16], 0, { mirror: true })])
};

const SKELETON_OVERLAY_BONES = {
    body: vanillaBone([0, 24, 0], 'waist', [vanillaCube([-4, 12, -2], [8, 12, 4], [16, 16], 0.25, { layer: true })]),
    waist: vanillaBone([0, 12, 0], null, [], { neverRender: true }),
    head: vanillaBone([0, 24, 0], 'body', [vanillaCube([-4, 24, -4], [8, 8, 8], [0, 0], 0.25, { layer: true })]),
    rightArm: vanillaBone([-5, 22, 0], 'body', [vanillaCube([-8, 12, -2], [4, 12, 4], [40, 16], 0.25, { layer: true })]),
    leftArm: vanillaBone([5, 22, 0], 'body', [vanillaCube([4, 12, -2], [4, 12, 4], [40, 16], 0.25, { mirror: true, layer: true })]),
    rightLeg: vanillaBone([-1.9, 12, 0], 'body', [vanillaCube([-3.9, 0, -2], [4, 12, 4], [0, 16], 0.25, { layer: true })]),
    leftLeg: vanillaBone([1.9, 12, 0], 'body', [vanillaCube([-0.1, 0, -2], [4, 12, 4], [0, 16], 0.25, { mirror: true, layer: true })])
};

const PIGLIN_BONES = {
    body: vanillaBone([0, 24, 0], null, [
        vanillaCube([-4, 12, -2], [8, 12, 4], [16, 16]),
        vanillaCube([-4, 12, -2], [8, 12, 4], [16, 32], 0.25, { layer: true })
    ]),
    head: vanillaBone([0, 24, 0], 'body', [
        vanillaCube([-5, 24, -4], [10, 8, 8], [0, 0], -0.02),
        vanillaCube([-2, 24, -5], [4, 4, 1], [31, 1], -0.02),
        vanillaCube([2, 24, -5], [1, 2, 1], [2, 4], -0.02),
        vanillaCube([-3, 24, -5], [1, 2, 1], [2, 0], -0.02)
    ]),
    leftear: vanillaBone([5, 30, 0], 'head', [vanillaCube([4, 25, -2], [1, 5, 4], [51, 6])], { rotation: [0, 0, -30] }),
    rightear: vanillaBone([-5, 30, 0], 'head', [vanillaCube([-5, 25, -2], [1, 5, 4], [39, 6])], { rotation: [0, 0, 30] }),
    hat: vanillaBone([0, 24, 0], 'head'),
    rightarm: vanillaBone([-5, 22, 0], 'body', [
        vanillaCube([-8, 12, -2], [4, 12, 4], [40, 16]),
        vanillaCube([-8, 12, -2], [4, 12, 4], [40, 32], 0.25, { layer: true })
    ]),
    rightItem: vanillaBone([-6, 15, 1], 'rightarm'),
    leftarm: vanillaBone([5, 22, 0], 'body', [
        vanillaCube([4, 12, -2], [4, 12, 4], [32, 48]),
        vanillaCube([4, 12, -2], [4, 12, 4], [48, 48], 0.25, { layer: true })
    ]),
    leftItem: vanillaBone([6, 15, 1], 'leftarm'),
    rightleg: vanillaBone([-1.9, 12, 0], 'body', [
        vanillaCube([-4, 0, -2], [4, 12, 4], [0, 16]),
        vanillaCube([-4, 0, -2], [4, 12, 4], [0, 32], 0.25, { layer: true })
    ]),
    leftleg: vanillaBone([1.9, 12, 0], 'body', [
        vanillaCube([0, 0, -2], [4, 12, 4], [16, 48]),
        vanillaCube([0, 0, -2], [4, 12, 4], [0, 48], 0.25, { layer: true })
    ])
};

const PILLAGER_BONES = {
    head: vanillaBone([0, 24, 0], 'body', [vanillaCube([-4, 24, -4], [8, 10, 8], [0, 0])]),
    nose: vanillaBone([0, 26, 0], 'head', [vanillaCube([-1, 23, -6], [2, 4, 2], [24, 0])]),
    body: vanillaBone([0, 0, 0], 'waist', [
        vanillaCube([-4, 12, -3], [8, 12, 6], [16, 20]),
        vanillaCube([-4, 6, -3], [8, 18, 6], [0, 38], 0.5)
    ]),
    waist: vanillaBone([0, 12, 0], null, [], { neverRender: true }),
    leftLeg: vanillaBone([2, 12, 0], 'body', [vanillaCube([0, 0, -2], [4, 12, 4], [0, 22])]),
    rightLeg: vanillaBone([-2, 12, 0], 'body', [vanillaCube([-4, 0, -2], [4, 12, 4], [0, 22], 0, { mirror: true })]),
    rightarm: vanillaBone([-5, 22, 0], 'body', [vanillaCube([-8, 12, -2], [4, 12, 4], [40, 46])]),
    rightItem: vanillaBone([-6, 15, 1], 'rightarm', [], { neverRender: true }),
    leftarm: vanillaBone([5, 22, 0], 'body', [vanillaCube([4, 12, -2], [4, 12, 4], [40, 46], 0, { mirror: true })]),
    leftItem: vanillaBone([6, 15, 1], 'leftarm', [], { neverRender: true })
};

const VINDICATOR_BONES = {
    head: vanillaBone([0, 24, 0], 'body', [vanillaCube([-4, 24, -4], [8, 10, 8], [0, 0])]),
    nose: vanillaBone([0, 26, 0], 'head', [vanillaCube([-1, 23, -6], [2, 4, 2], [24, 0])]),
    body: vanillaBone([0, 24, 0], null, [
        vanillaCube([-4, 12, -3], [8, 12, 6], [16, 20]),
        vanillaCube([-4, 6, -3], [8, 18, 6], [0, 38], 0.5)
    ]),
    arms: vanillaBone([0, 22, 0], 'body', [
        vanillaCube([-8, 16, -2], [4, 8, 4], [44, 22]),
        vanillaCube([4, 16, -2], [4, 8, 4], [44, 22]),
        vanillaCube([-4, 16, -2], [8, 4, 4], [40, 38])
    ]),
    leg0: vanillaBone([-2, 12, 0], 'body', [vanillaCube([-4, 0, -2], [4, 12, 4], [0, 22])]),
    leg1: vanillaBone([2, 12, 0], 'body', [vanillaCube([0, 0, -2], [4, 12, 4], [0, 22], 0, { mirror: true })]),
    rightArm: vanillaBone([-5, 22, 0], 'body', [vanillaCube([-8, 12, -2], [4, 12, 4], [40, 46])]),
    rightItem: vanillaBone([-5.5, 16, 0.5], 'rightArm', [], { neverRender: true }),
    leftArm: vanillaBone([5, 22, 0], 'body', [vanillaCube([4, 12, -2], [4, 12, 4], [40, 46], 0, { mirror: true })]),
    leftItem: vanillaBone([6, 15, 1], 'leftArm', [], { neverRender: true })
};

const ZOMBIE_VILLAGER_BONES = {
    head: vanillaBone([0, 24, 0], 'body', [
        vanillaCube([-4, 24, -4], [8, 10, 8], [0, 0], 0.25),
        vanillaCube([-1, 23, -6], [2, 4, 2], [24, 0], 0.25)
    ]),
    helmet: vanillaBone([0, 24, 0], 'head', [vanillaCube([-4, 24, -4], [8, 10, 8], [32, 0], 0.5, { layer: true })]),
    brim: vanillaBone([0, 24, 0], 'head', [vanillaCube([-8, 16, -6], [16, 16, 1], [30, 47], 0.1, { layer: true })], { rotation: [-90, 0, 0] }),
    body: vanillaBone([0, 24, 0], 'waist', [
        vanillaCube([-4, 12, -3], [8, 12, 6], [16, 20]),
        vanillaCube([-4, 6, -3], [8, 18, 6], [0, 38], 0.5)
    ]),
    waist: vanillaBone([0, 12, 0], null, [], { neverRender: true }),
    rightArm: vanillaBone([-5, 22, 0], 'body', [vanillaCube([-8, 12, -2], [4, 12, 4], [44, 22])]),
    rightItem: vanillaBone([-6, 15, 1], 'rightArm', [], { neverRender: true }),
    leftArm: vanillaBone([5, 22, 0], 'body', [vanillaCube([4, 12, -2], [4, 12, 4], [44, 22], 0, { mirror: true })]),
    leftItem: vanillaBone([6, 15, 1], 'leftArm', [], { neverRender: true }),
    rightLeg: vanillaBone([-2, 12, 0], 'body', [vanillaCube([-4, 0, -2], [4, 12, 4], [0, 22])]),
    leftLeg: vanillaBone([2, 12, 0], 'body', [vanillaCube([0, 0, -2], [4, 12, 4], [0, 22], 0, { mirror: true })])
};

const BABY_ZOMBIE_BONES = {
    Body: vanillaBone([0, 6.5, 0], null, [vanillaCube([-2, 4, -1], [4, 5, 2], [16, 16])]),
    Head: vanillaBone([0, 8.75, 0], 'Body', [
        vanillaCube([-3, 9, -3], [6, 6, 6], [3, 3]),
        vanillaCube([-3, 8.9, -3], [6, 6, 6], [35, 3], 0.25, { layer: true })
    ]),
    rightArm: vanillaBone([-3, 8.5, 0], 'Body', [vanillaCube([-4, 4, -1], [2, 5, 2], [36, 16])]),
    rightItem: vanillaBone([-3, 6.5, 0], 'rightArm'),
    leftArm: vanillaBone([3, 8.5, 0], 'Body', [vanillaCube([2, 4, -1], [2, 5, 2], [28, 16])]),
    leftItem: vanillaBone([3, 6.5, 0], 'leftArm'),
    rightLeg: vanillaBone([-1, 4, 0], 'Body', [vanillaCube([-2, 0, -1], [2, 4, 2], [8, 16])]),
    leftLeg: vanillaBone([1, 4, 0], 'Body', [vanillaCube([0, 0, -1], [2, 4, 2], [0, 16])])
};

const COPPER_GOLEM_BONES = {
    root: vanillaBone([1, 0, 0], null),
    body: vanillaBone([0, 5, 0], 'root', [vanillaCube([-4, 5, -3], [8, 6, 6], [0, 15])]),
    head: vanillaBone([0, 11, 0], 'body', [
        vanillaCube([-4, 11, -5], [8, 5, 10], [0, 0]),
        vanillaCube([-1, 10, -6], [2, 3, 2], [56, 0]),
        vanillaCube([-1, 16, -1], [2, 4, 2], [37, 8], -0.01),
        vanillaCube([-2, 20, -2], [4, 4, 4], [37, 0], -0.01)
    ]),
    right_arm: vanillaBone([-4, 11, 0], 'body', [vanillaCube([-7, 2, -2], [3, 10, 4], [36, 16])]),
    rightItem: vanillaBone([-5, 3.6, -1], 'right_arm'),
    left_arm: vanillaBone([4, 11, 0], 'body', [vanillaCube([4, 2, -2], [3, 10, 4], [50, 16])]),
    right_leg: vanillaBone([-2, 5, 0], 'root', [vanillaCube([-3.9, 0, -1.99], [4, 5, 4], [0, 27])]),
    left_leg: vanillaBone([2, 5, 0], 'root', [vanillaCube([-0.1, 0, -2], [4, 5, 4], [16, 27])])
};

// =========================
// Wearers
// =========================
const WEARER_RIGS = [
    {
        id: 'player_wide', label: 'display_sensei.wearer.player_wide',
        geometry: 'geometry.humanoid.custom',
        scale: PLAYER_ENTITY_SCALE,
        texture: 'assets/player_skin.png',
        textureSize: [64, 64],
        bones: PLAYER_WIDE_BONES,
        outerLayers: { head: 0.5, hat: 0.5, body: 0.25, rightArm: 0.25, leftArm: 0.25, rightLeg: 0.25, leftLeg: 0.25 },
        missing: []
    },
    {
        id: 'player_slim', label: 'display_sensei.wearer.player_slim',
        geometry: 'geometry.humanoid.customSlim',
        scale: PLAYER_ENTITY_SCALE,
        texture: 'assets/player_skin.png',
        textureSize: [64, 64],
        bones: PLAYER_SLIM_BONES,
        outerLayers: { head: 0.5, hat: 0.5, body: 0.25, rightArm: 0.25, leftArm: 0.25, rightLeg: 0.25, leftLeg: 0.25 },
        missing: []
    },
    {
        id: 'armor_stand', label: 'display_sensei.wearer.armor_stand',
        geometry: 'geometry.armor_stand',
        scale: 1,
        texture: 'assets/armor_stand.png',
        textureSize: [64, 64],
        bones: ARMOR_STAND_BONES,
        outerLayers: {},
        missing: []
    },
    {
        id: 'zombie', label: 'display_sensei.wearer.zombie',
        geometry: 'geometry.zombie.v1.8',
        scale: 1,
        texture: 'assets/zombie.png',
        textureSize: [64, 32],
        bones: ZOMBIE_BONES,
        outerLayers: {},
        missing: []
    },
    {
        id: 'husk', label: 'display_sensei.wearer.husk',
        geometry: 'geometry.zombie.husk.v1.8',
        scale: 1,
        texture: null,
        textureSize: [64, 32],
        bones: ZOMBIE_BONES,
        outerLayers: {},
        missing: []
    },
    {
        id: 'drowned', label: 'display_sensei.wearer.drowned',
        geometry: 'geometry.zombie.drowned.v1.16',
        scale: 1,
        texture: null,
        textureSize: [64, 64],
        bones: DROWNED_BONES,
        outerLayers: { head: 1.0, hat: 1.0, body: 0.5, rightArm: 0.5, leftArm: 0.5, rightLeg: 0.25, leftLeg: 0.25 },
        missing: []
    },
    {
        id: 'skeleton', label: 'display_sensei.wearer.skeleton',
        geometry: 'geometry.skeleton.v1.8',
        scale: 1,
        texture: null,
        textureSize: [64, 32],
        bones: SKELETON_BONES,
        outerLayers: {},
        missing: []
    },
    {
        id: 'stray', label: 'display_sensei.wearer.stray',
        geometry: 'geometry.skeleton.stray.v1.8',
        scale: 1,
        texture: null,
        textureSize: [64, 32],
        bones: SKELETON_BONES,
        outerLayers: { head: 0.25, hat: 0.25, body: 0.25, rightArm: 0.25, leftArm: 0.25, rightLeg: 0.25, leftLeg: 0.25 },
        missing: [],
        overlay: { geometry: 'geometry.stray.armor.v1.8', bones: SKELETON_OVERLAY_BONES }
    },
    {
        id: 'wither_skeleton', label: 'display_sensei.wearer.wither_skeleton',
        geometry: 'geometry.skeleton.wither.v1.8',
        scale: 1,
        texture: null,
        textureSize: [64, 32],
        bones: WITHER_SKELETON_BONES,
        outerLayers: {},
        missing: []
    },
    {
        id: 'bogged', label: 'display_sensei.wearer.bogged',
        geometry: 'geometry.skeleton.bogged',
        scale: 1,
        texture: null,
        textureSize: [64, 32],
        bones: BOGGED_BONES,
        outerLayers: { head: 0.25, hat: 0.25, body: 0.25, rightArm: 0.25, leftArm: 0.25, rightLeg: 0.25, leftLeg: 0.25 },
        missing: [],
        overlay: { geometry: 'geometry.bogged.armor', bones: SKELETON_OVERLAY_BONES }
    },
    {
        id: 'piglin', label: 'display_sensei.wearer.piglin',
        geometry: 'geometry.piglin',
        scale: 1,
        texture: null,
        textureSize: [64, 64],
        bones: PIGLIN_BONES,
        outerLayers: { body: 0.25, rightArm: 0.25, leftArm: 0.25, rightLeg: 0.25, leftLeg: 0.25 },
        missing: []
    },
    {
        id: 'piglin_brute', label: 'display_sensei.wearer.piglin_brute',
        geometry: 'geometry.piglin',
        scale: 1,
        texture: null,
        textureSize: [64, 64],
        bones: PIGLIN_BONES,
        outerLayers: { body: 0.25, rightArm: 0.25, leftArm: 0.25, rightLeg: 0.25, leftLeg: 0.25 },
        missing: []
    },
    {
        id: 'zombie_pigman', label: 'display_sensei.wearer.zombie_pigman',
        geometry: 'geometry.piglin',
        scale: 1,
        texture: null,
        textureSize: [64, 64],
        bones: PIGLIN_BONES,
        outerLayers: { body: 0.25, rightArm: 0.25, leftArm: 0.25, rightLeg: 0.25, leftLeg: 0.25 },
        missing: []
    },
    {
        id: 'pillager', label: 'display_sensei.wearer.pillager',
        geometry: 'geometry.pillager',
        scale: 1,
        texture: null,
        textureSize: [64, 64],
        bones: PILLAGER_BONES,
        outerLayers: { body: 0.5, rightLeg: 0.5, leftLeg: 0.5 },
        missing: ['hat'],
        hideArmor: true
    },
    {
        id: 'vindicator', label: 'display_sensei.wearer.vindicator',
        geometry: 'geometry.vindicator.v1.8',
        scale: 0.9375,
        texture: null,
        textureSize: [64, 64],
        bones: VINDICATOR_BONES,
        outerLayers: { body: 0.5 },
        missing: ['hat', 'rightLeg', 'leftLeg'],
        hideArmor: true
    },
    {
        id: 'zombie_villager', label: 'display_sensei.wearer.zombie_villager',
        geometry: 'geometry.zombie.villager_v2',
        scale: 1,
        texture: null,
        textureSize: [64, 64],
        bones: ZOMBIE_VILLAGER_BONES,
        outerLayers: { head: 0.5, body: 0.5, rightLeg: 0.5, leftLeg: 0.5 },
        missing: ['hat']
    },
    {
        id: 'baby_zombie', label: 'display_sensei.wearer.baby_zombie',
        geometry: 'geometry.zombie.baby',
        scale: 1,
        texture: null,
        textureSize: [64, 64],
        bones: BABY_ZOMBIE_BONES,
        outerLayers: { head: 0.25 },
        missing: ['hat'],
        baby: true
    },
    {
        id: 'copper_golem', label: 'display_sensei.wearer.copper_golem',
        geometry: 'geometry.copper_golem',
        scale: 1,
        texture: null,
        textureSize: [64, 64],
        bones: COPPER_GOLEM_BONES,
        outerLayers: {},
        missing: ['hat', 'rightArm', 'leftArm', 'rightLeg', 'leftLeg', 'leftItem']
    }
];

function findWearerRig(id) {
    return WEARER_RIGS.find(rig => rig.id === id) || null;
}

function findRigBoneName(rig, boneName) {
    if (!rig || typeof boneName !== 'string') return null;
    let wanted = boneName.toLowerCase();
    return Object.keys(rig.bones).find(name => name.toLowerCase() === wanted) || null;
}

// =========================
// Vanilla armor
// =========================
const HUMANOID_ARMOR_SHAPES = {
    head: { pivot: [0, 24, 0], origin: [-4, 24, -4], size: [8, 8, 8], uv: [0, 0] },
    hat: { pivot: [0, 24, 0], origin: [-4, 24, -4], size: [8, 8, 8], uv: [32, 0] },
    body: { pivot: [0, 24, 0], origin: [-4, 12, -2], size: [8, 12, 4], uv: [16, 16] },
    rightArm: { pivot: [-5, 22, 0], origin: [-8, 12, -2], size: [4, 12, 4], uv: [40, 16] },
    leftArm: { pivot: [5, 22, 0], origin: [4, 12, -2], size: [4, 12, 4], uv: [40, 16], mirror: true },
    rightLeg: { pivot: [-1.9, 12, 0], origin: [-3.9, 0, -2], size: [4, 12, 4], uv: [0, 16] },
    leftLeg: { pivot: [1.9, 12, 0], origin: [-0.1, 0, -2], size: [4, 12, 4], uv: [0, 16], mirror: true }
};

const ARMOR1_INFLATES = { head: 1.0, hat: 1.5, body: 1.01, rightArm: 1.0, leftArm: 1.0, rightLeg: 1.0, leftLeg: 1.0 };
const ARMOR2_INFLATES = { head: 0.5, body: 0.5, rightArm: 0.5, leftArm: 0.5, rightLeg: 0.49, leftLeg: 0.49 };

function flatArmorBones(boneNames, inflates) {
    let bones = {};
    for (let name of boneNames) {
        let shape = HUMANOID_ARMOR_SHAPES[name];
        let extras = shape.mirror ? { mirror: true } : {};
        bones[name] = vanillaBone(shape.pivot, null, [vanillaCube(shape.origin, shape.size, shape.uv, inflates[name], extras)]);
    }
    return bones;
}

const FLAT_ARMOR = {
    helmet: {
        geometry: 'geometry.humanoid.armor.helmet',
        playerGeometry: 'geometry.player.armor.helmet',
        textureWidth: 64, textureHeight: 32,
        layer: '_1',
        bones: flatArmorBones(['head', 'hat'], ARMOR1_INFLATES),
        approximate: true
    },
    chestplate: {
        geometry: 'geometry.humanoid.armor.chestplate',
        playerGeometry: 'geometry.player.armor.chestplate',
        textureWidth: 64, textureHeight: 32,
        layer: '_1',
        bones: flatArmorBones(['body', 'rightArm', 'leftArm'], ARMOR1_INFLATES)
    },
    leggings: {
        geometry: 'geometry.humanoid.armor.leggings',
        playerGeometry: 'geometry.player.armor.leggings',
        textureWidth: 64, textureHeight: 32,
        layer: '_2',
        bones: flatArmorBones(['body', 'rightLeg', 'leftLeg'], ARMOR2_INFLATES)
    },
    boots: {
        geometry: 'geometry.humanoid.armor.boots',
        playerGeometry: 'geometry.player.armor.boots',
        textureWidth: 64, textureHeight: 32,
        layer: '_1',
        bones: flatArmorBones(['rightLeg', 'leftLeg'], ARMOR1_INFLATES)
    }
};

const FLAT_ARMOR_BABY = {
    helmet: {
        geometry: 'geometry.humanoid.baby.armor.helmet',
        textureWidth: 64, textureHeight: 64,
        layer: '_baby',
        bones: {
            armor1: vanillaBone([0, 0, 0], null),
            Head: vanillaBone([0, 9, 0.5], 'armor1', [vanillaCube([-4.5, 9, -4], [9, 8, 8.3], [0, 0], 0.3)])
        }
    },
    chestplate: {
        geometry: 'geometry.humanoid.baby.armor.chestplate',
        textureWidth: 64, textureHeight: 64,
        layer: '_baby',
        bones: {
            armor1: vanillaBone([0, 0, 0], null),
            Body: vanillaBone([0, 6, 0], 'armor1', [vanillaCube([-3, 4, -1], [6, 5, 3], [0, 17], 0.3)]),
            RightArm: vanillaBone([-4, 9, 0.5], 'armor1', [vanillaCube([-5, 4.3, -0.97], [2, 5, 3], [30, 25], 0.3)]),
            LeftArm: vanillaBone([4, 9, 0.5], 'armor1', [vanillaCube([3, 4.3, -1.03], [2, 5, 3], [30, 17], 0.3)])
        }
    },
    leggings: {
        geometry: 'geometry.humanoid.baby.armor.leggings',
        textureWidth: 64, textureHeight: 64,
        layer: '_baby',
        bones: {
            armor2: vanillaBone([0, 0, 0], null),
            Body: vanillaBone([0, 6, 0], 'armor2', [vanillaCube([-3, 4, -1.5], [6, 5, 3], [0, 33], 0.27)]),
            RightLeg: vanillaBone([-1.5, 4, 0.5], 'armor2', [vanillaCube([-3, 0.2, -1], [3, 4, 3], [18, 17], 0.3)]),
            LeftLeg: vanillaBone([1.5, 4, 0.5], 'armor2', [vanillaCube([0, 0.2, -1.002], [3, 4, 3], [18, 24], 0.3)])
        }
    },
    boots: {
        geometry: 'geometry.humanoid.baby.armor.boots',
        textureWidth: 64, textureHeight: 64,
        layer: '_baby',
        bones: {
            armor1: vanillaBone([0, 0, 0], null),
            RightLeg: vanillaBone([-1.5, 4, 0.5], 'armor1', [vanillaCube([-3, 0.21, -1.004], [3, 1, 3], [0, 25], 0.5, { mirror: true })]),
            LeftLeg: vanillaBone([1.5, 4, 0.5], 'armor1', [vanillaCube([0, 0.2, -1.002], [3, 1, 3], [0, 29], 0.5)])
        }
    }
};

// =========================
// Bone names
// =========================
const BONE_ALIASES = {
    head: 'head', helm: 'head',
    hat: 'hat', hatlayer: 'hat', headlayer: 'hat', headwear: 'hat', headoverlay: 'hat',
    body: 'body', torso: 'body', chest: 'body', chestplate: 'body',
    rightarm: 'rightArm', armright: 'rightArm', rarm: 'rightArm', armr: 'rightArm',
    leftarm: 'leftArm', armleft: 'leftArm', larm: 'leftArm', arml: 'leftArm',
    rightleg: 'rightLeg', legright: 'rightLeg', rleg: 'rightLeg', legr: 'rightLeg', rightfoot: 'rightLeg', footright: 'rightLeg',
    leftleg: 'leftLeg', legleft: 'leftLeg', lleg: 'leftLeg', legl: 'leftLeg', leftfoot: 'leftLeg', footleft: 'leftLeg',
    leftitem: 'leftItem', itemleft: 'leftItem', offhand: 'leftItem'
};

function normalizeWearerBoneName(name) {
    return String(name).toLowerCase().replace(/[\s_-]+/g, '');
}

function findCanonicalWearerBone(name) {
    return BONE_ALIASES[normalizeWearerBoneName(name)] || null;
}

const RESERVED_MARKER_BONES = [
    'helmet', 'bodyArmor', 'belt',
    'rightArmArmor', 'leftArmArmor',
    'rightLegging', 'leftLegging',
    'rightBoot', 'leftBoot',
    'rightSock', 'leftSock'
];
const RESERVED_MARKER_WEARERS = ['player_wide', 'player_slim'];

// =========================
// Pose tests
// =========================
const WALK_SWING = 57.3 * 0.5;
const WALK_LEG_FACTOR = 1.4;

const RAISED_ARM_WEARERS = ['zombie', 'husk', 'zombie_pigman', 'zombie_villager', 'baby_zombie'];

const POSE_TESTS = [
    {
        id: 'walk', label: 'display_sensei.pose_test.walk', wearers: 'humanoid', chosen: true,
        bones: {
            rightArm: [-WALK_SWING, 0, 0],
            leftArm: [WALK_SWING, 0, 0],
            rightLeg: [WALK_SWING * WALK_LEG_FACTOR, 0.1, 0.1],
            leftLeg: [-WALK_SWING * WALK_LEG_FACTOR, -0.1, -0.1]
        },
        overrides: [{ wearers: RAISED_ARM_WEARERS, bones: { rightArm: ZOMBIE_ARMS.right.slice(), leftArm: ZOMBIE_ARMS.left.slice() } }]
    },
    {
        id: 'sneak', label: 'display_sensei.pose_test.sneak', wearers: ['player_wide', 'player_slim'], chosen: false,
        root: { pivot: SNEAK_PARENTS[0].pivot.slice(), position: SNEAK_PARENTS[0].pos.slice(), rotation: SNEAK_PARENTS[0].rot.slice() },
        positions: { body: SNEAK_PARENTS[1].pos.slice(), head: [0, SNEAK_HEAD_DROP, 0] },
        bones: {
            rightArm: [SNEAK_OTHER_ARM, 0, 0],
            leftArm: [SNEAK_OTHER_ARM, 0, 0],
            rightLeg: [SNEAK_LEG_TURN, 0.1, 0.1],
            leftLeg: [SNEAK_LEG_TURN, -0.1, -0.1]
        }
    },
    {
        id: 'arms_raised', label: 'display_sensei.pose_test.arms_raised', wearers: 'humanoid', chosen: false,
        bones: { rightArm: ZOMBIE_ARMS.right.slice(), leftArm: ZOMBIE_ARMS.left.slice() }
    },
    {
        id: 'look', label: 'display_sensei.pose_test.look', wearers: 'humanoid', chosen: true,
        bones: { head: [-30, 40, 0] }
    },
    {
        id: 'sit', label: 'display_sensei.pose_test.sit', wearers: 'humanoid', chosen: false,
        bones: {
            rightArm: [-36, 0, 0],
            leftArm: [-36, 0, 0],
            rightLeg: [-81, 18, 0],
            leftLeg: [-81, -18, 0]
        },
        overrides: [{ wearers: RAISED_ARM_WEARERS, bones: { rightArm: ZOMBIE_ARMS.right.slice(), leftArm: ZOMBIE_ARMS.left.slice() } }]
    }
];

function toRigBoneNames(rig, vectors) {
    let mapped = {};
    for (let [boneName, vector] of Object.entries(vectors || {})) {
        let rigName = findRigBoneName(rig, boneName);
        if (rigName) mapped[rigName] = vector.slice();
    }
    return mapped;
}

function copyWearerPoseRoot(root) {
    return root ? { pivot: root.pivot.slice(), position: root.position.slice(), rotation: root.rotation.slice() } : null;
}

function getWearerPoses(wearerId) {
    let rig = findWearerRig(wearerId);
    if (!rig) return [];
    if (rig.id === 'armor_stand') {
        return STAND_POSES.map(pose => {
            let turns = { body: pose.body, head: pose.head, rightArm: pose.rightarm, leftArm: pose.leftarm, rightLeg: pose.rightleg, leftLeg: pose.leftleg };
            if (pose.rightItem) turns.rightItem = pose.rightItem;
            return { id: pose.id, label: pose.labelKey, chosen: false, bones: toRigBoneNames(rig, turns), positions: {}, root: null };
        });
    }
    let poses = [];
    for (let pose of POSE_TESTS) {
        if (pose.wearers !== 'humanoid' && !pose.wearers.includes(rig.id)) continue;
        let turns = Object.assign({}, pose.bones);
        for (let override of pose.overrides || []) {
            if (override.wearers.includes(rig.id)) Object.assign(turns, override.bones);
        }
        let bones = toRigBoneNames(rig, turns);
        let positions = toRigBoneNames(rig, pose.positions);
        if (!Object.keys(bones).length && !Object.keys(positions).length && !pose.root) continue;
        poses.push({ id: pose.id, label: pose.label, chosen: pose.chosen, bones, positions, root: copyWearerPoseRoot(pose.root) });
    }
    return poses;
}

freezeArmorData(WEAR_SLOTS);
freezeArmorData(WEARER_BONE_NAMES);
freezeArmorData(WEARER_RIGS);
freezeArmorData(FLAT_ARMOR);
freezeArmorData(FLAT_ARMOR_BABY);
freezeArmorData(BONE_ALIASES);
freezeArmorData(RESERVED_MARKER_BONES);
freezeArmorData(RESERVED_MARKER_WEARERS);
freezeArmorData(POSE_TESTS);

// ---- src/attachable_rig.js ----

// =========================
// Attachable rig (read only)
// =========================

// =========================
// Reading the outliner
// =========================
function isRigBoneNode(node) {
    return !!node && node.type === 'group';
}

function isRigCubeNode(node) {
    return !!node && node.type === 'cube';
}

function isRigWearerNode(node, project) {
    return !!project.multi_file_ruleset && node.scope === 1;
}

function isRigNodeExported(node) {
    return node.export !== false;
}

const RIG_UNDRAWN_TYPES = ['group', 'locator', 'null_object', 'bounding_box'];

function rigDrawsOwnParts(group) {
    return (group.children || []).some(child => !!child && isRigNodeExported(child) && !RIG_UNDRAWN_TYPES.includes(child.type));
}

function isRigBoneExported(group) {
    let children = Array.isArray(group.children) ? group.children : [];
    let hasExportedChild = children.some(isRigNodeExported);
    if (!isRigNodeExported(group) && !rigHasExportedChild(group)) return false;
    if (!hasExportedChild && typeof settings !== 'undefined' && settings.export_empty_groups && settings.export_empty_groups.value === false) return false;
    if (children.length && children.every(child => child.type === 'bounding_box')) return false;
    return true;
}

function rigHasExportedChild(group) {
    for (let child of group.children || []) {
        if (isRigNodeExported(child)) return true;
        if (isRigBoneNode(child) && rigHasExportedChild(child)) return true;
    }
    return false;
}

// =========================
// Bedrock file values
// =========================
function rigNegate(value) {
    return 0 - value;
}

function rigFilePivot(origin) {
    return [rigNegate(origin[0]), origin[1], origin[2]];
}

function rigFileRotation(rotation) {
    return [rigNegate(rotation[0]), rigNegate(rotation[1]), rotation[2]];
}

function isRigTurned(rotation) {
    return Array.isArray(rotation) && rotation.some(angle => angle !== 0);
}

function readRigCube(cube) {
    let from = [rigNegate(cube.to[0]), cube.from[1], cube.from[2]];
    let to = [rigNegate(cube.from[0]), cube.to[1], cube.to[2]];
    let low = from.map((value, axis) => Math.min(value, to[axis]));
    let high = from.map((value, axis) => Math.max(value, to[axis]));
    let turned = isRigTurned(cube.rotation);
    return {
        uuid: cube.uuid,
        name: cube.name,
        from: low,
        to: high,
        inflate: cube.inflate || 0,
        pivot: turned ? rigFilePivot(cube.origin) : null,
        rotation: turned ? rigFileRotation(cube.rotation) : null
    };
}

function readRigBone(group, parentName) {
    let rotation = Array.isArray(group.rotation) ? group.rotation : [0, 0, 0];
    let cubes = (group.children || []).filter(child => isRigCubeNode(child) && isRigNodeExported(child)).map(readRigCube);
    return {
        uuid: group.uuid,
        name: group.name,
        parent: parentName,
        pivot: rigFilePivot(group.origin || [0, 0, 0]),
        rotation: isRigTurned(rotation) ? rigFileRotation(rotation) : [0, 0, 0],
        binding: group.bedrock_binding || null,
        isRoot: parentName === null,
        cubes,
        draws: rigDrawsOwnParts(group)
    };
}

// =========================
// The analyser
// =========================
function analyseAttachableRig(project = Project) {
    let result = { bones: [], roots: [], bound: [] };
    if (!project || !Array.isArray(project.outliner)) return result;

    let looseCubes = [];
    let addBone = (group, parentName) => {
        if (isRigWearerNode(group, project) || !isRigBoneExported(group)) return;
        let bone = readRigBone(group, parentName);
        result.bones.push(bone);
        for (let child of group.children || []) {
            if (isRigBoneNode(child)) addBone(child, bone.name);
        }
    };
    for (let node of project.outliner) {
        if (isRigBoneNode(node)) {
            addBone(node, null);
        } else if (isRigCubeNode(node) && isRigNodeExported(node) && !isRigWearerNode(node, project)) {
            looseCubes.push(readRigCube(node));
        }
    }
    if (looseCubes.length) {
        let groups = Array.isArray(project.groups) ? project.groups : result.bones;
        let taken = new Set(groups.map(group => String(group.name).toLowerCase()));
        let name = 'bb_main';
        for (let number = 2; taken.has(name); number++) name = 'bb_main' + number;
        result.bones.unshift({
            uuid: null, name, parent: null, pivot: [0, 0, 0], rotation: [0, 0, 0],
            binding: null, isRoot: true, cubes: looseCubes, draws: true, loose: true
        });
    }
    result.roots = result.bones.filter(bone => bone.isRoot).map(bone => bone.name);
    result.bound = result.bones.filter(bone => bone.binding).map(bone => bone.name);
    return result;
}

// ---- src/armor_route.js ----

// =========================
// Armor route (back end)
// =========================

// =========================
// Wear slots and bone names
// =========================
const DEFAULT_WEARER_ID = 'player_wide';

function isArmorSlotId(slotId) {
    return typeof slotId === 'string' && slotId.startsWith('slot.armor.') && !!findWearSlot(slotId);
}

const ARMOR_BONE_NAMES = WEAR_SLOTS
    .filter(slot => isArmorSlotId(slot.id))
    .reduce((names, slot) => names.concat(slot.bones.filter(name => !names.includes(name))), []);

const CANONICAL_WEARER_BONES = Object.values(BONE_ALIASES)
    .reduce((names, name) => names.includes(name) ? names : names.concat(name), ARMOR_BONE_NAMES.slice());

function matchWearerBoneName(name) {
    if (typeof name !== 'string' || !name) return null;
    let lower = name.toLowerCase();
    let exact = CANONICAL_WEARER_BONES.find(canonical => canonical.toLowerCase() === lower);
    if (exact) return { name: exact, exact: true };
    let alias = findCanonicalWearerBone(name);
    return alias ? { name: alias, exact: false } : null;
}

const ITEM_SLOT_BONES = {
    'slot.armor.head': 'head',
    'slot.weapon.offhand': 'leftItem'
};

function getItemSlotBone(slotId) {
    return ITEM_SLOT_BONES[slotId] || null;
}

function parseBoneBinding(binding) {
    if (typeof binding !== 'string' || !binding.trim()) return { kind: 'none', hand: false };
    if (/item_slot_to_bone_name/i.test(binding)) return { kind: 'item_slot', hand: true };
    let names = Array.from(binding.matchAll(/'([\w.]+)'/g), match => match[1]);
    let bones = names.filter(name => name !== 'main_hand' && name !== 'off_hand');
    let hand = bones.length > 0 && bones.every(name => /^(right|left)item$/i.test(name));
    if (bones.length === 1 && names.length === 1) return { kind: 'bone', target: bones[0], hand };
    return { kind: 'other', hand };
}

function getBindingTarget(binding, slotId) {
    if (binding.kind === 'bone') return binding.target;
    if (binding.kind === 'item_slot') return getItemSlotBone(slotId);
    return null;
}

// =========================
// Reading the model
// =========================
function readModelRig(project) {
    let rig;
    try {
        rig = analyseAttachableRig(project);
    } catch (error) {
        console.warn(LOG_PREFIX, 'Could not read the bones of this model:', error);
        return null;
    }
    if (!rig || !Array.isArray(rig.bones)) return null;
    let byName = new Map();
    let bones = rig.bones.map(bone => {
        let entry = Object.assign({}, bone, { parsedBinding: parseBoneBinding(bone.binding) });
        byName.set(String(bone.name).toLowerCase(), entry);
        return entry;
    });
    return { bones, byName };
}

function findModelParent(rig, bone) {
    return typeof bone.parent === 'string' ? rig.byName.get(bone.parent.toLowerCase()) || null : null;
}

function readModelWear(rig) {
    let wear = { armorBones: new Set(), boundTargets: [], handBound: false };
    if (!rig) return wear;
    for (let bone of rig.bones) {
        let binding = bone.parsedBinding;
        if (binding.hand) wear.handBound = true;
        if (binding.kind === 'bone' && !binding.hand) wear.boundTargets.push(binding.target);
        if (binding.kind !== 'none') continue;
        let match = matchWearerBoneName(bone.name);
        if (match && ARMOR_BONE_NAMES.includes(match.name)) wear.armorBones.add(match.name);
    }
    return wear;
}

function inferSlotsFromBones(names) {
    let arms = names.has('rightArm') || names.has('leftArm');
    let legs = names.has('rightLeg') || names.has('leftLeg');
    let slots = [];
    if (names.has('head') || names.has('hat')) slots.push('slot.armor.head');
    if (arms || (names.has('body') && !legs)) slots.push('slot.armor.chest');
    if (legs) slots.push(names.has('body') && !arms ? 'slot.armor.legs' : 'slot.armor.feet');
    return slots;
}

function findSlotsInParentSetup(script) {
    if (typeof script !== 'string' || !script) return [];
    return WEAR_SLOTS.filter(slot => {
        if (!slot.layerVariable) return false;
        let name = slot.layerVariable.split('.').pop();
        return new RegExp(`\\b(?:variable|v)\\.${name}\\s*=(?!=)`, 'i').test(script);
    }).map(slot => slot.id);
}

function readBlockbenchParentSetup(project) {
    let manager = project && project.BedrockEntityManager;
    let entity = manager && manager.client_entity;
    if (!entity || entity.type !== 'attachable' || !entity.description) return null;
    let scripts = entity.description.scripts;
    return isPlainObject(scripts) && typeof scripts.parent_setup === 'string' ? scripts.parent_setup : null;
}

function readAttachableSetup(project) {
    let wear = getLinkedWearInfo(project);
    if (wear && (wear.renderControllers.length || wear.parentSetup !== null)) {
        return { found: true, parentSetup: wear.parentSetup };
    }
    let manager = project && project.BedrockEntityManager;
    let entity = manager && manager.client_entity;
    if (entity && entity.type === 'attachable') return { found: true, parentSetup: readBlockbenchParentSetup(project) };
    return { found: false, parentSetup: null };
}

// =========================
// What the model is (getWearInfo)
// =========================
function createUnknownWearInfo() {
    return { kind: 'unknown', slot: null, slots: [], method: null, source: null };
}

function isWearableProject(project) {
    return !!project && !!project.format && project.format.id === ENTITY_FORMAT_ID && getBedrockEntityKind(project) !== 'entity';
}

function kindFromBones(modelWear) {
    if (modelWear.handBound) return { kind: 'worn', method: 'binding' };
    if (modelWear.armorBones.size) return { kind: 'armor', method: 'name' };
    if (modelWear.boundTargets.length) return { kind: 'worn', method: 'binding' };
    return { kind: 'armor', method: null };
}

function wearInfoFromWearableSlot(slot, modelWear) {
    let wearSlot = findWearSlot(slot) ? slot : null;
    if (slot === 'slot.weapon.offhand' || slot === 'slot.weapon.mainhand') {
        return { kind: 'held', slot: wearSlot, slots: wearSlot ? [wearSlot] : [], method: modelWear.handBound ? 'binding' : null, source: 'pack' };
    }
    if (isArmorSlotId(slot)) {
        return Object.assign(kindFromBones(modelWear), { slot, slots: [slot], source: 'pack' });
    }
    let bound = modelWear.handBound || modelWear.boundTargets.length > 0;
    return { kind: 'worn', slot: null, slots: [], method: bound ? 'binding' : null, source: 'pack' };
}

function wearInfoFromLayerSlots(slots, modelWear, source) {
    return Object.assign(kindFromBones(modelWear), { slot: slots[0], slots, source });
}

function wearInfoFromBones(modelWear) {
    if (!modelWear.handBound && modelWear.armorBones.size >= 2) {
        let slots = inferSlotsFromBones(modelWear.armorBones);
        return { kind: 'armor', slot: slots[0] || null, slots, method: 'name', source: 'bones' };
    }
    if (modelWear.handBound) return { kind: 'held', slot: null, slots: [], method: 'binding', source: 'bones' };
    let boundArmor = new Set(modelWear.boundTargets
        .map(target => matchWearerBoneName(target))
        .filter(match => match && match.exact && ARMOR_BONE_NAMES.includes(match.name))
        .map(match => match.name));
    if (boundArmor.size) {
        let slots = inferSlotsFromBones(boundArmor);
        return { kind: 'worn', slot: slots[0] || null, slots, method: 'binding', source: 'bones' };
    }
    return createUnknownWearInfo();
}

function detectWearInfo(project, modelWear) {
    let wear = getLinkedWearInfo(project);
    if (wear && wear.slot) return wearInfoFromWearableSlot(wear.slot, modelWear);
    let packSlots = wear ? findSlotsInParentSetup(wear.parentSetup) : [];
    if (packSlots.length) return wearInfoFromLayerSlots(packSlots, modelWear, 'pack');
    let fileSlots = findSlotsInParentSetup(readBlockbenchParentSetup(project));
    if (fileSlots.length) return wearInfoFromLayerSlots(fileSlots, modelWear, 'file');
    return wearInfoFromBones(modelWear);
}

function getWearInfo(project = Project) {
    if (!isWearableProject(project)) return createUnknownWearInfo();
    let found = detectWearInfo(project, readModelWear(readModelRig(project)));
    let saved = getProjectData(project).armor;
    if (saved.kind === 'auto') return found;
    return {
        kind: saved.kind,
        slot: saved.slot || found.slot,
        slots: saved.slot ? [saved.slot] : found.slots,
        method: found.method,
        source: 'saved'
    };
}

function isArmorProject(project = Project) {
    return getWearInfo(project).kind === 'armor';
}

function recordArmorDataEdit(undoLabel, change) {
    if (!Project || getRoute() !== 'attachable' || Undo.current_save) return false;
    let before = JSON.stringify(getProjectData().armor);
    Undo.initEdit({ [PROJECT_DATA_UNDO_ASPECT]: true });
    try {
        updateProjectData(change);
    } catch (error) {
        Undo.cancelEdit(true);
        throw error;
    }
    if (JSON.stringify(getProjectData().armor) === before) {
        Undo.cancelEdit(false);
    } else {
        Undo.finishEdit(undoLabel);
    }
    return true;
}

function setWearKind(kind, slot = null) {
    if (!PROJECT_ARMOR_KINDS.includes(kind) || (slot !== null && !findWearSlot(slot))) return false;
    let done = recordArmorDataEdit(i18n('display_sensei.undo.armor_kind'), data => {
        data.armor.kind = kind;
        data.armor.slot = kind === 'auto' ? null : slot;
    });
    if (done) {
        syncArmorSafeMode(Project, true);
        validateOpenProject();
    }
    return done;
}

// =========================
// Safe mode
// =========================
let switchedPreviewModes = new WeakSet();
let autoSwitchedProjects = new WeakSet();
let lastWearChoices = new WeakMap();

function readWearChoice(project) {
    let armor = getProjectData(project).armor;
    return `${armor.kind}|${armor.slot || ''}`;
}

function setPreviewMode(project, mode) {
    let modeSelect = BarItems.bedrock_animation_mode;
    if (project === Project && modeSelect && (mode === 'entity' || Modes.animate)) {
        modeSelect.change(mode);
    } else {
        project.bedrock_animation_mode = mode;
        if (project === Project && modeSelect) modeSelect.set(mode);
    }
}

function syncArmorSafeMode(project = Project, explicit = false) {
    if (!isWearableProject(project)) return false;
    lastWearChoices.set(project, readWearChoice(project));
    let mode = project.bedrock_animation_mode;
    if (isArmorProject(project)) {
        if (mode !== 'attachable_first' || (!explicit && autoSwitchedProjects.has(project))) return false;
        setPreviewMode(project, 'entity');
        switchedPreviewModes.add(project);
        autoSwitchedProjects.add(project);
        return true;
    }
    if (!explicit || !switchedPreviewModes.has(project) || mode !== 'entity') return false;
    setPreviewMode(project, 'attachable_first');
    switchedPreviewModes.delete(project);
    return true;
}

function restoreSwitchedPreviewModes() {
    for (let project of ModelProject.all) {
        if (switchedPreviewModes.has(project) && project.bedrock_animation_mode === 'entity') setPreviewMode(project, 'attachable_first');
    }
    switchedPreviewModes = new WeakSet();
    autoSwitchedProjects = new WeakSet();
    lastWearChoices = new WeakMap();
}

function checkArmorSafeMode(project) {
    if (!isWearableProject(project)) return;
    if (syncArmorSafeMode(project)) {
        if (project === Project) validateOpenProject();
    } else if (project.bedrock_animation_mode === 'attachable_first' && getWearInfo(project).kind === 'unknown') {
        requestPackLinkScan(project);
    }
}

function wrapInitEntity() {
    if (typeof BedrockEntityManager === 'undefined') return { delete() {} };
    return wrapMethod(BedrockEntityManager.prototype, 'initEntity', function(original, args) {
        let result = original.apply(this, args);
        try {
            checkArmorSafeMode(this.project);
        } catch (error) {
            console.warn(LOG_PREFIX, 'The armor safe mode failed:', error);
        }
        return result;
    });
}

function onArmorProjectSelected(event) {
    checkArmorSafeMode(event && event.project);
}

function onArmorProjectParsed() {
    checkArmorSafeMode(Project);
}

function onArmorPackScanned(project) {
    if (syncArmorSafeMode(project) && project === Project) validateOpenProject();
}

function onArmorUndoRedo() {
    if (!Project || !lastWearChoices.has(Project) || lastWearChoices.get(Project) === readWearChoice(Project)) return;
    syncArmorSafeMode(Project, true);
    validateOpenProject();
}

function validateOpenProject() {
    if (typeof Validator !== 'undefined' && Project) Validator.validate();
}

function wrapBindingCheck() {
    let check = typeof Validator !== 'undefined' ? Validator.checks.find(entry => entry.id === 'bedrock_binding') : null;
    if (!check || typeof check.run !== 'function') return { delete() {} };
    let wrapper = wrapMethod(check, 'run', function(original, args) {
        if (isArmorProject()) return undefined;
        return original.apply(this, args);
    });
    validateOpenProject();
    return {
        delete() {
            wrapper.delete();
            validateOpenProject();
        }
    };
}

// =========================
// Small helpers
// =========================
const WEAR_POSITION_EPSILON = 0.001;
const WEAR_FACE_EPSILON = 0.005;
const BOUND_ROOT_ANCHOR = [0, 24, 0];

function subtractVectors(a, b) {
    return a.map((value, index) => value - b[index]);
}

function vectorLength(vector) {
    return Math.hypot(vector[0], vector[1], vector[2]);
}

function isZeroRotation(rotation) {
    return !Array.isArray(rotation) || rotation.every(value => Math.abs(value) < WEAR_POSITION_EPSILON);
}

function formatArmorNumber(value) {
    let rounded = Math.round(value * 1000) / 1000;
    return String(rounded === 0 ? 0 : rounded);
}

function formatArmorVector(vector) {
    return '[' + vector.map(formatArmorNumber).join(', ') + ']';
}

// =========================
// Fit check
// =========================
const ARMOR_CHECK_TEXT_KEYS = {
    nothing_follows: 'display_sensei.armor_check.nothing_follows',
    slot_empty: 'display_sensei.armor_check.slot_empty',
    slot_mix: 'display_sensei.armor_check.slot_mix',
    name_alias: 'display_sensei.armor_check.name_alias',
    pivot_delta: 'display_sensei.armor_check.pivot_delta',
    pivot_wearer: 'display_sensei.armor_check.pivot_wearer',
    reserved_marker: 'display_sensei.armor_check.reserved_marker',
    nested_match: 'display_sensei.armor_check.nested_match',
    bound_offset: 'display_sensei.armor_check.bound_offset',
    item_slot_binding: 'display_sensei.armor_check.item_slot_binding',
    binding_version: 'display_sensei.armor_check.binding_version',
    clearance_inside: 'display_sensei.armor_check.clearance_inside',
    clearance_flicker: 'display_sensei.armor_check.clearance_flicker',
    clipping: 'display_sensei.armor_check.clipping',
    vanilla_overlap: 'display_sensei.armor_check.vanilla_overlap',
    no_parent_setup: 'display_sensei.armor_check.no_parent_setup',
    target_missing: 'display_sensei.armor_check.target_missing',
    wearer_hides_armor: 'display_sensei.armor_check.wearer_hides_armor'
};

const ARMOR_SEVERITY_ORDER = ['error', 'warning', 'info'];

function createArmorCheck(type, key, severity, values, bones, options = {}) {
    return {
        check: {
            id: key ? `${type}:${key}` : type,
            severity,
            textKey: ARMOR_CHECK_TEXT_KEYS[type],
            values,
            bones,
            fixes: options.fixes || [],
            approximate: !!options.approximate
        },
        fix: options.fix || null
    };
}

function createCheckContext(slot, wearer, rig) {
    let baby = isBabyWearer(wearer);
    let targets = new Map();
    for (let bone of rig.bones) {
        if (bone.parsedBinding.kind !== 'none') continue;
        let key = findRigBoneName(wearer, bone.name);
        if (key) targets.set(bone, key);
    }
    return {
        slot,
        wearer,
        wearerLabel: i18n(wearer.label),
        rig,
        targets,
        flatArmor: baby ? FLAT_ARMOR_BABY : FLAT_ARMOR
    };
}

function isBabyWearer(wearer) {
    return wearer.baby === true;
}

function findVanillaArmorPivot(flatArmor, name) {
    for (let piece of Object.values(flatArmor)) {
        let key = findRigBoneName(piece, name);
        if (key && piece.bones[key].pivot) return piece.bones[key].pivot;
    }
    return null;
}

function checkSlotCoverage(context, results) {
    let { slot, rig } = context;
    let followed = new Set();
    for (let bone of rig.bones) {
        let name = bone.parsedBinding.kind === 'none' ? bone.name : getBindingTarget(bone.parsedBinding, slot.id);
        let match = matchWearerBoneName(name);
        if (match && match.exact && ARMOR_BONE_NAMES.includes(match.name)) followed.add(match.name);
    }
    let slotBones = slot.bones.join(', ');
    if (!followed.size) {
        results.push(createArmorCheck('nothing_follows', null, 'error', { bones: slotBones }, []));
        return;
    }
    if (!slot.bones.some(name => followed.has(name))) {
        results.push(createArmorCheck('slot_empty', null, 'warning', { bones: slotBones }, []));
    }
    let others = Array.from(followed).filter(name => !slot.bones.includes(name));
    if (others.length) {
        results.push(createArmorCheck('slot_mix', null, 'info', { bones: others.join(', ') }, others));
    }
}

function checkBoneNames(context, results) {
    let { rig } = context;
    for (let bone of rig.bones) {
        if (bone.parsedBinding.kind !== 'none' || context.targets.has(bone)) continue;
        let match = matchWearerBoneName(bone.name);
        if (!match || match.exact) continue;
        if (rig.byName.has(match.name.toLowerCase())) continue;
        results.push(createArmorCheck('name_alias', bone.name, 'warning', { bone: bone.name, target: match.name }, [bone.name], {
            fixes: ['rename'],
            fix: { uuid: bone.uuid, name: match.name }
        }));
    }
}

function findStandardArmorPivot(name) {
    let vanilla = findVanillaArmorPivot(FLAT_ARMOR, name);
    if (vanilla) return vanilla;
    let player = findWearerRig(DEFAULT_WEARER_ID);
    let key = findRigBoneName(player, name);
    return key && Array.isArray(player.bones[key].pivot) ? player.bones[key].pivot : null;
}

function isSamePivot(a, b) {
    return Array.isArray(a) && Array.isArray(b) && vectorLength(subtractVectors(a, b)) <= WEAR_POSITION_EPSILON;
}

function findModelChildren(rig, bone) {
    let name = String(bone.name).toLowerCase();
    return rig.bones.filter(child => typeof child.parent === 'string' && child.parent.toLowerCase() === name);
}

function isPivotDrawn(context, bone) {
    if (bone.draws !== false) return true;
    return findModelChildren(context.rig, bone)
        .some(child => child.parsedBinding.kind === 'none' && !context.targets.has(child) && isPivotDrawn(context, child));
}

function checkPivots(context, results) {
    let { wearer, wearerLabel, flatArmor } = context;
    for (let [bone, key] of context.targets) {
        if (!isPivotDrawn(context, bone)) continue;
        let wearerPivot = wearer.bones[key].pivot;
        if (!Array.isArray(wearerPivot) || !Array.isArray(bone.pivot)) continue;
        let delta = subtractVectors(wearerPivot, bone.pivot);
        if (vectorLength(delta) <= WEAR_POSITION_EPSILON) continue;
        let standardPivot = findStandardArmorPivot(bone.name);
        let values = {
            bone: bone.name,
            target: key,
            wearer: wearerLabel,
            pivot: formatArmorVector(bone.pivot),
            wearer_pivot: formatArmorVector(wearerPivot),
            delta: formatArmorVector(delta),
            standard_pivot: standardPivot ? formatArmorVector(standardPivot) : ''
        };
        if (isSamePivot(standardPivot, bone.pivot) || isSamePivot(findVanillaArmorPivot(flatArmor, bone.name), bone.pivot)) {
            results.push(createArmorCheck('pivot_wearer', bone.name, 'info', values, [bone.name], { approximate: true }));
        } else {
            results.push(createArmorCheck('pivot_delta', bone.name, 'warning', values, [bone.name], {
                approximate: true,
                fixes: standardPivot ? ['snap_pivot_keep', 'snap_pivot_move'] : [],
                fix: standardPivot ? { uuid: bone.uuid, pivot: standardPivot.slice() } : null
            }));
        }
    }
}

function checkReservedNames(context, results) {
    if (!RESERVED_MARKER_WEARERS.includes(context.wearer.id)) return;
    let reserved = RESERVED_MARKER_BONES.map(name => name.toLowerCase());
    for (let bone of context.rig.bones) {
        if (!reserved.includes(String(bone.name).toLowerCase())) continue;
        results.push(createArmorCheck('reserved_marker', bone.name, 'info', { bone: bone.name, wearer: context.wearerLabel }, [bone.name]));
    }
}

function checkNestedBones(context, results) {
    let { rig } = context;
    for (let bone of context.targets.keys()) {
        let ancestor = findModelParent(rig, bone);
        while (ancestor && !context.targets.has(ancestor)) ancestor = findModelParent(rig, ancestor);
        if (!ancestor) continue;
        results.push(createArmorCheck('nested_match', bone.name, 'info', { bone: bone.name, parent: ancestor.name }, [bone.name, ancestor.name], {
            fixes: ['flatten'],
            fix: { uuid: bone.uuid }
        }));
    }
}

function checkBindings(context, results) {
    let { slot, wearer, rig } = context;
    let anyBinding = false;
    for (let bone of rig.bones) {
        let binding = bone.parsedBinding;
        if (binding.kind === 'none') continue;
        anyBinding = true;
        if (binding.kind === 'item_slot' && slot.id !== 'slot.armor.head') {
            results.push(createArmorCheck('item_slot_binding', bone.name, 'info', { bone: bone.name }, [bone.name], { approximate: true }));
        }
        let target = getBindingTarget(binding, slot.id);
        if (!target) continue;
        let key = findRigBoneName(wearer, target);
        if (!key) {
            results.push(createArmorCheck('target_missing', bone.name, 'info', { bone: bone.name, target, wearer: context.wearerLabel }, [bone.name], { approximate: true }));
            continue;
        }
        let parent = findModelParent(rig, bone);
        let anchor = parent ? parent.pivot : BOUND_ROOT_ANCHOR;
        if (!Array.isArray(anchor) || !Array.isArray(wearer.bones[key].pivot)) continue;
        let offset = subtractVectors(wearer.bones[key].pivot, anchor);
        if (vectorLength(offset) <= WEAR_POSITION_EPSILON) continue;
        results.push(createArmorCheck('bound_offset', bone.name, 'warning', { bone: bone.name, target: key, offset: formatArmorVector(offset) }, [bone.name], {
            approximate: true,
            fixes: ['wrap_pivot_parent'],
            fix: { uuid: bone.uuid, pivot: wearer.bones[key].pivot.slice() }
        }));
    }
    if (anyBinding) results.push(createArmorCheck('binding_version', null, 'info', {}, []));
}

function getOuterLayerInflate(wearer, key) {
    let layers = wearer.outerLayers || {};
    let name = Object.keys(layers).find(entry => entry.toLowerCase() === key.toLowerCase());
    return name && typeof layers[name] === 'number' ? layers[name] : null;
}

function getSurfaceInflate(wearerCube, outer) {
    let own = typeof wearerCube.inflate === 'number' ? wearerCube.inflate : 0;
    return outer === null ? own : Math.max(own, outer);
}

function getWearerBaseCubes(wearerBone) {
    if (wearerBone.neverRender) return [];
    let cubes = (wearerBone.cubes || []).filter(cube => isZeroRotation(cube.rotation));
    let solid = cubes.filter(cube => !cube.layer);
    return solid.length ? solid : cubes;
}

function boxFromOriginSize(cube, inflate = 0, offset = [0, 0, 0]) {
    let min = cube.origin.map((value, axis) => value - inflate + offset[axis]);
    let max = cube.origin.map((value, axis) => value + cube.size[axis] + inflate + offset[axis]);
    return { min, max };
}

function boxFromModelCube(cube, offset) {
    let inflate = typeof cube.inflate === 'number' ? cube.inflate : 0;
    let min = cube.from.map((value, axis) => Math.min(value, cube.to[axis]) - inflate + offset[axis]);
    let max = cube.from.map((value, axis) => Math.max(value, cube.to[axis]) + inflate + offset[axis]);
    return { min, max };
}

function growBox(box, amount) {
    return { min: box.min.map(value => value - amount), max: box.max.map(value => value + amount) };
}

function mergeBoxes(boxes) {
    return {
        min: [0, 1, 2].map(axis => Math.min(...boxes.map(box => box.min[axis]))),
        max: [0, 1, 2].map(axis => Math.max(...boxes.map(box => box.max[axis])))
    };
}

function findWearerOverlayBoxes(wearer, key) {
    let bones = wearer.overlay && wearer.overlay.bones;
    let name = bones ? findRigBoneName({ bones }, key) : null;
    let bone = name ? bones[name] : null;
    if (!bone || bone.neverRender || !Array.isArray(bone.pivot)) return [];
    let offset = subtractVectors(wearer.bones[key].pivot, bone.pivot);
    return (bone.cubes || []).filter(cube => isZeroRotation(cube.rotation)).map(cube => boxFromOriginSize(cube, cube.inflate || 0, offset));
}

function getSurfaceReach(surface, base) {
    return Math.max(0, ...[0, 1, 2].map(axis => Math.max(base.min[axis] - surface.min[axis], surface.max[axis] - base.max[axis])));
}

function getWrappedAxes(box, inner) {
    return [0, 1, 2].map(axis => box.min[axis] <= inner.min[axis] + WEAR_FACE_EPSILON && box.max[axis] >= inner.max[axis] - WEAR_FACE_EPSILON);
}

function countWrappedAxes(box, inner) {
    return getWrappedAxes(box, inner).filter(Boolean).length;
}

function boxesIntersect(a, b) {
    for (let axis = 0; axis < 3; axis++) {
        if (a.min[axis] >= b.max[axis] - WEAR_FACE_EPSILON || a.max[axis] <= b.min[axis] + WEAR_FACE_EPSILON) return false;
    }
    return true;
}

function compareWrappingFaces(box, surface) {
    let result = null;
    for (let axis = 0; axis < 3; axis++) {
        for (let reach of [surface.min[axis] - box.min[axis], box.max[axis] - surface.max[axis]]) {
            if (reach < -WEAR_FACE_EPSILON) return 'inside';
            if (Math.abs(reach) <= WEAR_FACE_EPSILON) result = 'flicker';
        }
    }
    return result;
}

function boxContains(outer, inner) {
    return [0, 1, 2].every(axis => outer.min[axis] <= inner.min[axis] + WEAR_FACE_EPSILON && outer.max[axis] >= inner.max[axis] - WEAR_FACE_EPSILON);
}

function isCoveredBox(box, boxes, base, surface) {
    return boxes.some(other => other !== box && boxContains(other, box) && countWrappedAxes(other, base) === 3 && compareWrappingFaces(other, surface) === null);
}

function haveSharedFace(a, b) {
    for (let axis = 0; axis < 3; axis++) {
        if (Math.abs(a.min[axis] - b.min[axis]) <= WEAR_FACE_EPSILON) return true;
        if (Math.abs(a.max[axis] - b.max[axis]) <= WEAR_FACE_EPSILON) return true;
    }
    return false;
}

function findVanillaNeighbourBoxes(context, key) {
    let { slot, wearer, flatArmor } = context;
    let neighbours = [];
    for (let other of WEAR_SLOTS) {
        if (other.id === slot.id || !isArmorSlotId(other.id) || !other.flatPiece) continue;
        let piece = flatArmor[other.flatPiece];
        let pieceKey = piece ? findRigBoneName(piece, key) : null;
        if (!pieceKey) continue;
        let pieceBone = piece.bones[pieceKey];
        let offset = subtractVectors(wearer.bones[key].pivot, pieceBone.pivot);
        let boxes = (pieceBone.cubes || []).map(cube => boxFromOriginSize(cube, cube.inflate || 0, offset));
        if (boxes.length) neighbours.push({ slot: other, boxes, approximate: !!piece.approximate });
    }
    return neighbours;
}

function checkClearance(context, results) {
    let { wearer, wearerLabel } = context;
    for (let [bone, key] of context.targets) {
        if (!isZeroRotation(bone.rotation) || !Array.isArray(bone.cubes)) continue;
        if (!Array.isArray(wearer.bones[key].pivot) || !Array.isArray(bone.pivot)) continue;
        let offset = subtractVectors(wearer.bones[key].pivot, bone.pivot);
        let approximate = vectorLength(offset) > WEAR_POSITION_EPSILON;
        let outer = getOuterLayerInflate(wearer, key);
        let wearerCubes = getWearerBaseCubes(wearer.bones[key]);
        let overlayBoxes = findWearerOverlayBoxes(wearer, key);
        let surfaceOf = wearerCube => mergeBoxes([growBox(boxFromOriginSize(wearerCube), getSurfaceInflate(wearerCube, outer))].concat(overlayBoxes));
        let neighbours = findVanillaNeighbourBoxes(context, key);
        let clearance = null;
        let clipping = false;
        let overlaps = new Map();
        let boxes = bone.cubes.filter(cube => isZeroRotation(cube.rotation)).map(cube => boxFromModelCube(cube, offset));
        for (let box of boxes) {
            for (let wearerCube of wearerCubes) {
                let base = boxFromOriginSize(wearerCube);
                let surface = surfaceOf(wearerCube);
                if (isCoveredBox(box, boxes, base, surface)) continue;
                let axes = getWrappedAxes(box, base);
                let wrapped = axes.filter(Boolean).length;
                if (wrapped === 3) {
                    let result = compareWrappingFaces(box, surface);
                    if (result === 'inside' || (result === 'flicker' && !clearance)) clearance = result;
                    for (let neighbour of neighbours) {
                        let sharesFace = neighbour.boxes.some(vanillaBox => countWrappedAxes(vanillaBox, base) === 3 && haveSharedFace(box, vanillaBox));
                        if (sharesFace) overlaps.set(neighbour.slot.id, neighbour);
                    }
                } else if (wrapped === 2 && axes[1] && boxesIntersect(box, surface)) {
                    clipping = true;
                }
            }
        }
        let layer = Math.max(0, ...wearerCubes.map(wearerCube => getSurfaceReach(surfaceOf(wearerCube), boxFromOriginSize(wearerCube))));
        let values = { bone: bone.name, target: key, wearer: wearerLabel, layer: formatArmorNumber(layer) };
        if (clearance) {
            results.push(createArmorCheck(clearance === 'inside' ? 'clearance_inside' : 'clearance_flicker', bone.name, 'warning', values, [bone.name], { approximate }));
        }
        if (clipping) results.push(createArmorCheck('clipping', bone.name, 'info', values, [bone.name], { approximate }));
        for (let neighbour of overlaps.values()) {
            let overlapValues = Object.assign({}, values, { slot: i18n(neighbour.slot.label) });
            results.push(createArmorCheck('vanilla_overlap', `${bone.name}:${neighbour.slot.id}`, 'info', overlapValues, [bone.name], {
                approximate: approximate || neighbour.approximate
            }));
        }
    }
}

function checkParentSetup(context, results) {
    let setup = readAttachableSetup(Project);
    if (!setup.found || !context.slot.layerVariable) return;
    if (findSlotsInParentSetup(setup.parentSetup).includes(context.slot.id)) return;
    results.push(createArmorCheck('no_parent_setup', null, 'info', { variable: context.slot.layerVariable }, []));
}

function checkMissingTargets(context, results) {
    let { slot, wearer, rig } = context;
    let missing = (wearer.missing || []).map(name => name.toLowerCase());
    for (let bone of rig.bones) {
        if (bone.parsedBinding.kind !== 'none') continue;
        let match = matchWearerBoneName(bone.name);
        if (!match || !match.exact || !slot.bones.includes(match.name)) continue;
        if (findRigBoneName(wearer, match.name) && !missing.includes(match.name.toLowerCase())) continue;
        results.push(createArmorCheck('target_missing', bone.name, 'info', { bone: bone.name, target: match.name, wearer: context.wearerLabel }, [bone.name], { approximate: true }));
    }
}

function checkWearerHidesArmor(context, results) {
    if (context.wearer.hideArmor !== true) return;
    results.push(createArmorCheck('wearer_hides_armor', null, 'info', { wearer: context.wearerLabel }, [], { approximate: true }));
}

function collectArmorChecks(slotId, wearerId) {
    let slot = findWearSlot(slotId);
    if (!slot || !isArmorSlotId(slotId) || !Project || getRoute() !== 'attachable') return [];
    let wearer = findWearerRig(wearerId) || findWearerRig(DEFAULT_WEARER_ID);
    let rig = readModelRig(Project);
    if (!wearer || !rig) return [];
    let context = createCheckContext(slot, wearer, rig);
    let results = [];
    checkSlotCoverage(context, results);
    checkBoneNames(context, results);
    checkPivots(context, results);
    checkBindings(context, results);
    checkClearance(context, results);
    checkNestedBones(context, results);
    checkReservedNames(context, results);
    checkMissingTargets(context, results);
    checkWearerHidesArmor(context, results);
    checkParentSetup(context, results);
    let unique = [];
    for (let result of results) {
        if (!unique.some(other => other.check.id === result.check.id)) unique.push(result);
    }
    return unique.sort((a, b) => ARMOR_SEVERITY_ORDER.indexOf(a.check.severity) - ARMOR_SEVERITY_ORDER.indexOf(b.check.severity));
}

function runArmorChecks(slotId, wearerId) {
    return collectArmorChecks(slotId, wearerId).map(result => cloneJson(result.check));
}

// =========================
// Fixes
// =========================
function findGroupByUuid(uuid) {
    return Group.all.find(group => group.uuid === uuid) || null;
}

function findGroupByName(name) {
    return Group.all.find(group => group.name === name) || null;
}

function collectDescendants(group) {
    let groups = [];
    let elements = [];
    group.forEachChild(child => {
        if (child instanceof Group) groups.push(child);
        else elements.push(child);
    });
    return { groups, elements };
}

function getPositionArrays(node) {
    let arrays = new Set();
    for (let key of ['from', 'to', 'origin', 'position']) {
        if (Array.isArray(node[key])) arrays.add(node[key]);
    }
    return Array.from(arrays);
}

function moveDescendants(group, delta) {
    group.forEachChild(child => {
        for (let array of getPositionArrays(child)) {
            for (let axis = 0; axis < 3; axis++) array[axis] += delta[axis];
        }
    });
}

function unrotateVectorZYX(vector, degrees) {
    let [x, y, z] = vector;
    let [ax, ay, az] = degrees.map(value => -value * DEGREES);
    [x, y] = [x * Math.cos(az) - y * Math.sin(az), x * Math.sin(az) + y * Math.cos(az)];
    [x, z] = [x * Math.cos(ay) + z * Math.sin(ay), -x * Math.sin(ay) + z * Math.cos(ay)];
    [y, z] = [y * Math.cos(ax) - z * Math.sin(ax), y * Math.sin(ax) + z * Math.cos(ax)];
    return [x, y, z];
}

function getPivotTransferShift(oldPivot, newPivot, rotation) {
    let shift = subtractVectors(oldPivot, newPivot);
    return subtractVectors(unrotateVectorZYX(shift, rotation), shift);
}

function recordArmorModelEdit(aspects, undoLabel, change) {
    Undo.initEdit(aspects);
    let finishAspects;
    try {
        finishAspects = change();
    } catch (error) {
        Undo.cancelEdit(true);
        throw error;
    }
    Undo.finishEdit(undoLabel, finishAspects || undefined);
}

function fixRename(fix) {
    let group = findGroupByUuid(fix.uuid);
    let lower = fix.name.toLowerCase();
    if (!group || Group.all.some(other => other !== group && other.name.toLowerCase() === lower)) return false;
    let oldName = group.name;
    recordArmorModelEdit({ groups: [group], [PROJECT_DATA_UNDO_ASPECT]: true }, i18n('display_sensei.undo.armor_rename'), () => {
        group.name = fix.name;
        group.sanitizeName();
        group.createUniqueName();
        renameFitOffsets(oldName, group.name);
    });
    return true;
}

function renameFitOffsets(oldName, newName) {
    if (oldName === newName) return;
    updateProjectData(data => {
        for (let slotOffsets of Object.values(data.armor.fit)) {
            if (!slotOffsets[oldName]) continue;
            slotOffsets[newName] = slotOffsets[oldName];
            delete slotOffsets[oldName];
        }
    });
}

function fixSnapPivot(fix, keepCubes) {
    let group = findGroupByUuid(fix.uuid);
    if (!group) return false;
    let pivot = toBlockbenchPosition(fix.pivot);
    let descendants = collectDescendants(group);
    let groups = [group].concat(descendants.groups);
    recordArmorModelEdit({ groups, elements: descendants.elements }, i18n('display_sensei.undo.armor_pivot'), () => {
        let shift = keepCubes ? getPivotTransferShift(group.origin, pivot, group.rotation) : subtractVectors(pivot, group.origin);
        for (let axis = 0; axis < 3; axis++) group.origin[axis] = pivot[axis];
        moveDescendants(group, shift);
        Canvas.updateView({ groups, elements: descendants.elements, selection: true });
    });
    return true;
}

function fixFlatten(fix) {
    let group = findGroupByUuid(fix.uuid);
    if (!group || !(group.parent instanceof Group)) return false;
    let top = group;
    while (top.parent instanceof Group) top = top.parent;
    recordArmorModelEdit({ outliner: true, groups: [group] }, i18n('display_sensei.undo.armor_flatten'), () => {
        group.addTo('root', Outliner.root.indexOf(top) + 1);
        Canvas.updateAllBones();
    });
    return true;
}

function fixWrapPivotParent(fix) {
    let group = findGroupByUuid(fix.uuid);
    if (!group) return false;
    let parent = group.parent instanceof Group ? group.parent : 'root';
    let siblings = parent === 'root' ? Outliner.root : parent.children;
    recordArmorModelEdit({ outliner: true, groups: [] }, i18n('display_sensei.undo.armor_wrap'), () => {
        let wrapper = new Group({ name: `${group.name}_pivot`, origin: toBlockbenchPosition(fix.pivot) });
        wrapper.createUniqueName();
        wrapper.isOpen = true;
        wrapper.addTo(parent, siblings.indexOf(group));
        wrapper.init();
        group.addTo(wrapper);
        Canvas.updateAllBones();
        return { outliner: true, groups: [wrapper] };
    });
    return true;
}

const ARMOR_FIXES = {
    rename: fixRename,
    snap_pivot_keep: fix => fixSnapPivot(fix, true),
    snap_pivot_move: fix => fixSnapPivot(fix, false),
    flatten: fixFlatten,
    wrap_pivot_parent: fixWrapPivotParent
};

function applyArmorFix(checkId, fixId, slotId, wearerId) {
    if (!canEditAttachable() || Undo.current_save || !ARMOR_FIXES[fixId]) return false;
    let result = collectArmorChecks(slotId, wearerId).find(entry => entry.check.id === checkId);
    if (!result || !result.fix || !result.check.fixes.includes(fixId)) return false;
    return ARMOR_FIXES[fixId](result.fix);
}

// =========================
// Fit offsets
// =========================
function listSlotBoneNames(slotId) {
    let slot = findWearSlot(slotId);
    let rig = slot && Project ? readModelRig(Project) : null;
    if (!rig) return [];
    return rig.bones.filter(bone => {
        let name = bone.parsedBinding.kind === 'none' ? bone.name : getBindingTarget(bone.parsedBinding, slotId);
        let match = matchWearerBoneName(name);
        return !!match && slot.bones.includes(match.name);
    }).map(bone => bone.name);
}

function getFitOffsets(slotId) {
    if (!findWearSlot(slotId) || !Project) return {};
    let saved = getProjectData().armor.fit[slotId] || {};
    let offsets = {};
    for (let name of listSlotBoneNames(slotId)) offsets[name] = cloneJson(ARMOR_FIT_IDENTITY);
    for (let name of Object.keys(saved)) offsets[name] = cloneJson(saved[name]);
    return offsets;
}

function setFitOffset(slotId, bone, channel, xyz) {
    if (!findWearSlot(slotId) || !ARMOR_FIT_CHANNELS.includes(channel) || !isFitChannelValue(channel, xyz)) return false;
    if (!Project || !findGroupByName(bone)) return false;
    return recordArmorDataEdit(i18n('display_sensei.undo.armor_fit'), data => {
        let slotOffsets = data.armor.fit[slotId] || (data.armor.fit[slotId] = {});
        let offset = slotOffsets[bone] || (slotOffsets[bone] = cloneJson(ARMOR_FIT_IDENTITY));
        offset[channel] = xyz.slice();
    });
}

function resetFitOffsets(slotId) {
    if (!findWearSlot(slotId)) return false;
    return recordArmorDataEdit(i18n('display_sensei.undo.armor_fit_reset'), data => {
        delete data.armor.fit[slotId];
    });
}

function toBlockbenchFitOffset(offset) {
    return {
        position: toBlockbenchPosition(offset.position),
        rotation: toBlockbenchRotation(offset.rotation),
        scale: offset.scale.slice()
    };
}

function isPlacedByOwnWearerBone(group, slotId) {
    let binding = parseBoneBinding(group.bedrock_binding);
    if (binding.kind !== 'none') return !!getBindingTarget(binding, slotId);
    let match = matchWearerBoneName(group.name);
    return !!match && match.exact;
}

function moveGroupTree(group, delta) {
    for (let axis = 0; axis < 3; axis++) group.origin[axis] += delta[axis];
    moveDescendants(group, delta);
}

function bakeGroupFitOffset(group, fileOffset, slotId) {
    let offset = toBlockbenchFitOffset(fileOffset);
    let pivot = group.origin.slice();
    let rotation = group.rotation.map((value, axis) => value + offset.rotation[axis]);
    let shift = unrotateVectorZYX(offset.position, rotation);
    let uniform = offset.scale.every(value => Math.abs(value - offset.scale[0]) < WEAR_POSITION_EPSILON);
    let movePoint = point => point.map((value, axis) => pivot[axis] + shift[axis] + offset.scale[axis] * (value - pivot[axis]));
    let bakeChildren = (parent, parentPivotMove) => {
        for (let child of parent.children) {
            if (child instanceof Group && isPlacedByOwnWearerBone(child, slotId)) {
                if (parseBoneBinding(child.bedrock_binding).kind !== 'none') moveGroupTree(child, parentPivotMove);
                continue;
            }
            let pivotBefore = child instanceof Group ? child.origin.slice() : null;
            for (let array of getPositionArrays(child)) {
                let moved = movePoint(array);
                for (let axis = 0; axis < 3; axis++) array[axis] = moved[axis];
            }
            if (Array.isArray(child.from) && Array.isArray(child.to)) {
                for (let axis = 0; axis < 3; axis++) {
                    let low = Math.min(child.from[axis], child.to[axis]);
                    child.to[axis] = Math.max(child.from[axis], child.to[axis]);
                    child.from[axis] = low;
                }
            }
            if (uniform && typeof child.inflate === 'number') child.inflate *= offset.scale[0];
            if (child instanceof Group) bakeChildren(child, subtractVectors(child.origin, pivotBefore));
        }
    };
    bakeChildren(group, [0, 0, 0]);
    for (let axis = 0; axis < 3; axis++) group.rotation[axis] = rotation[axis];
}

function getGroupDepth(group) {
    let depth = 0;
    for (let parent = group.parent; parent instanceof Group; parent = parent.parent) depth++;
    return depth;
}

function bakeFitOffsets(slotId) {
    if (!findWearSlot(slotId) || !canEditAttachable() || Undo.current_save) return false;
    let saved = getProjectData().armor.fit[slotId];
    if (!saved) return false;
    let missing = Object.keys(saved).filter(name => !findGroupByName(name));
    if (missing.length) {
        showNotification('armor_bake', i18nFormat('display_sensei.message.armor_bake_missing', { bones: missing.join(', ') }));
    }
    let targets = Object.keys(saved)
        .filter(name => !missing.includes(name))
        .map(name => ({ name, group: findGroupByName(name), offset: saved[name] }))
        .sort((a, b) => getGroupDepth(b.group) - getGroupDepth(a.group));
    if (!targets.length) return false;
    let groups = [];
    let elements = [];
    for (let target of targets) {
        let descendants = collectDescendants(target.group);
        for (let group of [target.group].concat(descendants.groups)) if (!groups.includes(group)) groups.push(group);
        for (let element of descendants.elements) if (!elements.includes(element)) elements.push(element);
    }
    recordArmorModelEdit({ groups, elements, [PROJECT_DATA_UNDO_ASPECT]: true }, i18n('display_sensei.undo.armor_bake'), () => {
        for (let target of targets) bakeGroupFitOffset(target.group, target.offset, slotId);
        updateProjectData(data => {
            let slotOffsets = data.armor.fit[slotId] || {};
            for (let target of targets) delete slotOffsets[target.name];
            if (!Object.keys(slotOffsets).length) delete data.armor.fit[slotId];
        });
        Canvas.updateView({ groups, elements, selection: true });
    });
    return true;
}

// =========================
// Install
// =========================
function installArmorRoute() {
    let hooks = createDeletables([
        wrapInitEntity,
        wrapBindingCheck,
        () => Blockbench.on('select_project', guardListener('select_project', onArmorProjectSelected)),
        () => Codecs.project.on('parsed', guardListener('armor project parsed', onArmorProjectParsed)),
        () => onPackLinkScanned(guardListener('armor pack scan', onArmorPackScanned)),
        () => Blockbench.on('undo redo', guardListener('armor undo', onArmorUndoRedo))
    ]);
    guardListener('select_project', onArmorProjectSelected)({ project: Project });
    return {
        delete() {
            hooks.delete();
            restoreSwitchedPreviewModes();
        }
    };
}

registerModuleInstaller('armor_route', installArmorRoute);

// ---- src/hold_link.js ----

// =========================
// Held 3D items: link (read only)
// =========================

// =========================
// Hold slots
// =========================
const HOLD_VIEWS = ['first_person', 'third_person'];
const HOLD_HANDS = ['main_hand', 'off_hand'];
const HOLD_CHANNELS = ['position', 'rotation', 'scale'];
const HOLD_IDENTITY = Object.freeze({ position: [0, 0, 0], rotation: [0, 0, 0], scale: [1, 1, 1] });
const HOLD_FLIPPED_AXES = Object.freeze({ position: [true, false, false], rotation: [true, true, false], scale: [false, false, false] });
const HOLD_AXIS_LETTERS = ['x', 'y', 'z'];

const HOLD_SLOT_CELLS = Object.freeze({
    firstperson_righthand: { view: 'first_person', hand: 'main_hand' },
    firstperson_lefthand: { view: 'first_person', hand: 'off_hand' },
    thirdperson_righthand: { view: 'third_person', hand: 'main_hand' },
    thirdperson_lefthand: { view: 'third_person', hand: 'off_hand' }
});

function holdCellKey(view, hand) {
    return `${view}.${hand}`;
}

const HOLD_CELLS = HOLD_VIEWS.reduce((cells, view) => cells.concat(HOLD_HANDS.map(hand => holdCellKey(view, hand))), []);

function findHoldSlot(slotId) {
    let cell = HOLD_SLOT_CELLS[slotId];
    return cell ? { slotId, view: cell.view, hand: cell.hand, cell: holdCellKey(cell.view, cell.hand) } : null;
}

function findHoldSlotId(view, hand) {
    return Object.keys(HOLD_SLOT_CELLS).find(slotId => HOLD_SLOT_CELLS[slotId].view === view && HOLD_SLOT_CELLS[slotId].hand === hand) || null;
}

function getOtherHoldHand(hand) {
    return hand === 'main_hand' ? 'off_hand' : 'main_hand';
}

function getHoldIdentity(channel) {
    return HOLD_IDENTITY[channel].slice();
}

function isHoldAxisFlipped(channel, axis) {
    return !!HOLD_FLIPPED_AXES[channel] && HOLD_FLIPPED_AXES[channel][axis];
}

function roundHoldNumber(value) {
    let rounded = Math.round(value * 10000) / 10000;
    return rounded === 0 ? 0 : rounded;
}

function toFileHoldPivot(origin) {
    return [roundHoldNumber(-origin[0]), roundHoldNumber(origin[1]), roundHoldNumber(origin[2])];
}

// =========================
// Reading Molang (the hold patterns only)
// =========================
const HOLD_FIRST_PERSON_NAMES = ['c.is_first_person', 'context.is_first_person', 'q.is_first_person', 'query.is_first_person'];
const HOLD_ITEM_SLOT_NAMES = ['c.item_slot', 'context.item_slot', 'q.item_slot', 'query.item_slot'];
const HOLD_MOLANG_TOKEN = /\s*(?:((?:\d+\.?\d*|\.\d+)(?:e[+-]?\d+)?)f?|([a-z_][a-z0-9_]*(?:\.[a-z_][a-z0-9_]*)*)|'([^']*)'|(==|!=|&&|\|\||[!?:()\-]))/iy;

function tokenizeHoldMolang(text) {
    let source = String(text).trim().replace(/;\s*$/, '').trim();
    if (!source) return null;
    let pattern = new RegExp(HOLD_MOLANG_TOKEN.source, 'iy');
    let tokens = [];
    let index = 0;
    while (index < source.length) {
        pattern.lastIndex = index;
        let match = pattern.exec(source);
        if (!match || pattern.lastIndex === index) return null;
        index = pattern.lastIndex;
        if (match[1] !== undefined) tokens.push({ type: 'number', value: parseFloat(match[1]) });
        else if (match[2] !== undefined) tokens.push({ type: 'name', value: match[2].toLowerCase() });
        else if (match[3] !== undefined) tokens.push({ type: 'string', value: match[3].toLowerCase() });
        else tokens.push({ type: 'op', value: match[4] });
    }
    return tokens;
}

function parseHoldMolang(text) {
    let tokens = typeof text === 'number' ? [{ type: 'number', value: text }] : tokenizeHoldMolang(text);
    if (!tokens || !tokens.length) return null;
    let position = 0;
    let peek = value => position < tokens.length && tokens[position].type === 'op' && tokens[position].value === value;
    let take = value => {
        if (!peek(value)) throw new Error(`Expected ${value}`);
        position++;
    };
    let primary = () => {
        let token = tokens[position++];
        if (!token) throw new Error('Unexpected end');
        if (token.type === 'number' || token.type === 'string') return { type: 'value', value: token.value };
        if (token.type === 'name') return { type: 'name', value: token.value };
        if (token.value === '(') {
            let inner = ternary();
            take(')');
            return inner;
        }
        throw new Error(`Unexpected ${token.value}`);
    };
    let unary = () => {
        if (peek('!')) {
            position++;
            return { type: 'not', value: unary() };
        }
        if (peek('-')) {
            position++;
            return { type: 'negate', value: unary() };
        }
        return primary();
    };
    let equality = () => {
        let left = unary();
        while (peek('==') || peek('!=')) {
            let operator = tokens[position++].value;
            left = { type: operator === '==' ? 'equal' : 'differ', left, right: unary() };
        }
        return left;
    };
    let and = () => {
        let left = equality();
        while (peek('&&')) {
            position++;
            left = { type: 'and', left, right: equality() };
        }
        return left;
    };
    let or = () => {
        let left = and();
        while (peek('||')) {
            position++;
            left = { type: 'or', left, right: and() };
        }
        return left;
    };
    let ternary = () => {
        let condition = or();
        if (!peek('?')) return condition;
        position++;
        let yes = ternary();
        take(':');
        return { type: 'ternary', condition, yes, no: ternary() };
    };
    try {
        let tree = ternary();
        return position === tokens.length ? tree : null;
    } catch (error) {
        return null;
    }
}

function isHoldMolangTrue(value) {
    return typeof value === 'string' ? value !== '' : value !== 0;
}

function evaluateHoldMolang(node, context) {
    switch (node.type) {
        case 'value':
            return node.value;
        case 'name':
            if (node.value === 'true') return 1;
            if (node.value === 'false') return 0;
            if (HOLD_FIRST_PERSON_NAMES.includes(node.value)) return context.view === 'first_person' ? 1 : 0;
            if (HOLD_ITEM_SLOT_NAMES.includes(node.value)) return context.hand;
            throw new Error(`Unknown name ${node.value}`);
        case 'not':
            return isHoldMolangTrue(evaluateHoldMolang(node.value, context)) ? 0 : 1;
        case 'negate': {
            let value = evaluateHoldMolang(node.value, context);
            if (typeof value !== 'number') throw new Error('Not a number');
            return -value;
        }
        case 'equal':
        case 'differ': {
            let left = evaluateHoldMolang(node.left, context);
            let right = evaluateHoldMolang(node.right, context);
            let same = typeof left === typeof right && left === right;
            return (node.type === 'equal') === same ? 1 : 0;
        }
        case 'and':
            return isHoldMolangTrue(evaluateHoldMolang(node.left, context)) && isHoldMolangTrue(evaluateHoldMolang(node.right, context)) ? 1 : 0;
        case 'or':
            return isHoldMolangTrue(evaluateHoldMolang(node.left, context)) || isHoldMolangTrue(evaluateHoldMolang(node.right, context)) ? 1 : 0;
        case 'ternary':
            return evaluateHoldMolang(isHoldMolangTrue(evaluateHoldMolang(node.condition, context)) ? node.yes : node.no, context);
    }
    throw new Error('Unknown node');
}

function fillHoldTable(read) {
    let table = {};
    for (let view of HOLD_VIEWS) {
        for (let hand of HOLD_HANDS) table[holdCellKey(view, hand)] = read(view, hand);
    }
    return table;
}

function readHoldMolangTable(value) {
    if (typeof value === 'number') return Number.isFinite(value) ? fillHoldTable(() => value) : null;
    if (typeof value !== 'string') return null;
    let tree = parseHoldMolang(value);
    if (!tree) return null;
    try {
        let table = fillHoldTable((view, hand) => evaluateHoldMolang(tree, { view, hand }));
        return Object.values(table).every(entry => typeof entry === 'number' && Number.isFinite(entry)) ? table : null;
    } catch (error) {
        return null;
    }
}

function readHoldConditionCells(condition) {
    if (condition === null || condition === undefined || condition === '') return HOLD_CELLS.slice();
    let tree = parseHoldMolang(typeof condition === 'number' ? condition : String(condition));
    if (!tree) return null;
    try {
        return HOLD_CELLS.filter(cell => {
            let [view, hand] = cell.split('.');
            return isHoldMolangTrue(evaluateHoldMolang(tree, { view, hand }));
        });
    } catch (error) {
        return null;
    }
}

// =========================
// Writing Molang (the hold patterns only)
// =========================
function composeHoldHandExpression(main, off) {
    let mainValue = roundHoldNumber(main);
    let offValue = roundHoldNumber(off);
    if (mainValue === offValue) return mainValue;
    return `c.item_slot == 'off_hand' ? ${offValue} : ${mainValue}`;
}

function composeHoldViewExpression(table, view, plays) {
    let hands = HOLD_HANDS.filter(hand => plays.includes(holdCellKey(view, hand)));
    if (!hands.length) return null;
    let main = table[holdCellKey(view, hands[0])];
    let off = table[holdCellKey(view, hands[hands.length - 1])];
    return hands.length === 2 ? composeHoldHandExpression(main, off) : roundHoldNumber(hands[0] === 'main_hand' ? main : off);
}

function composeHoldMolang(table, plays) {
    let parts = HOLD_VIEWS.map(view => composeHoldViewExpression(table, view, plays));
    let [first, third] = parts;
    if (first === null && third === null) return 0;
    if (first === null) return third;
    if (third === null || first === third) return first;
    let wrap = part => (typeof part === 'string' ? `(${part})` : String(part));
    return `c.is_first_person ? ${wrap(first)} : ${wrap(third)}`;
}

function sameHoldTables(a, b, cells = HOLD_CELLS) {
    if (!a || !b) return false;
    return cells.every(cell => roundHoldNumber(a[cell]) === roundHoldNumber(b[cell]));
}

// =========================
// The attachable
// =========================
function readBlockbenchAttachable(project = Project) {
    let manager = project && project.BedrockEntityManager;
    let entity = manager && manager.client_entity;
    return entity && entity.type === 'attachable' && isPlainObject(entity.description) ? entity.description : null;
}

function readHoldAttachable(project = Project) {
    let linked = getLinkedAttachable(project);
    if (linked && isPlainObject(linked.description)) return { description: linked.description, path: linked.path || null, source: 'pack' };
    let description = readBlockbenchAttachable(project);
    return description ? { description: cloneJson(description), path: null, source: 'file' } : null;
}

function readAnimateEntries(description) {
    let animations = isPlainObject(description.animations) ? description.animations : {};
    let scripts = isPlainObject(description.scripts) ? description.scripts : {};
    let animate = Array.isArray(scripts.animate) ? scripts.animate : (typeof scripts.animate === 'string' ? [scripts.animate] : []);
    let entries = [];
    for (let item of animate) {
        let pairs = typeof item === 'string' ? [[item, null]] : (isPlainObject(item) ? Object.entries(item) : []);
        for (let [short, condition] of pairs) {
            let id = animations[short];
            if (typeof id !== 'string') continue;
            let text = typeof condition === 'string' || typeof condition === 'number' ? String(condition) : null;
            entries.push({
                short,
                id,
                condition: text,
                cells: readHoldConditionCells(text),
                controller: id.startsWith('controller.')
            });
        }
    }
    return entries;
}

// =========================
// The hold bone
// =========================
function isHandBoundGroup(group) {
    return !!group && parseBoneBinding(group.bedrock_binding).hand;
}

function findHoldBone() {
    if (!Project || !Array.isArray(Outliner.root)) return null;
    let roots = Outliner.root.filter(node => node instanceof Group);
    let bound = roots.find(isHandBoundGroup);
    let group = bound || roots[0] || null;
    if (!group) return null;
    return {
        group,
        name: group.name,
        uuid: group.uuid,
        binding: group.bedrock_binding || null,
        bound: !!bound,
        pivot: toFileHoldPivot(group.origin),
        rotated: Array.isArray(group.rotation) && group.rotation.some(angle => angle !== 0)
    };
}

function findHoldAnimation(name) {
    if (!name || !Project) return null;
    return Animation.all.find(animation => animation.name === name) || null;
}

function findHoldAnimator(animation, bone) {
    if (!animation || !bone) return null;
    let byUuid = animation.animators[bone.uuid];
    if (byUuid && byUuid.type === 'bone') return byUuid;
    let wanted = String(bone.name).toLowerCase();
    return Object.values(animation.animators).find(animator => !!animator && animator.type === 'bone' && String(animator.name).toLowerCase() === wanted) || null;
}

function animationMovesBone(name, bone) {
    let animator = findHoldAnimator(findHoldAnimation(name), bone);
    return !!animator && HOLD_CHANNELS.some(channel => Array.isArray(animator[channel]) && animator[channel].length > 0);
}

// =========================
// Holds per view and hand
// =========================
function getHoldStem() {
    let name = Project && typeof Project.geometry_name === 'string' ? Project.geometry_name : '';
    let stem = name.replace(/^geometry\./, '').replace(/[^a-z0-9_.]+/gi, '_').replace(/^\.+|\.+$/g, '').toLowerCase();
    return stem || 'item';
}

function getPlannedHoldName(view) {
    return `animation.${getHoldStem()}.${view}_hold`;
}

function chooseHoldEntry(cell, entries, bone) {
    let candidates = entries.filter(entry => !entry.controller && Array.isArray(entry.cells) && entry.cells.includes(cell));
    if (candidates.length === 1) return { status: 'linked', entry: candidates[0] };
    let moving = candidates.filter(entry => animationMovesBone(entry.id, bone));
    if (moving.length === 1) return { status: 'linked', entry: moving[0] };
    if (moving.length > 1) return { status: 'stacked', entry: null };
    if (candidates.length) return { status: 'linked', entry: candidates[0] };
    return { status: entries.some(entry => entry.controller) ? 'controller' : 'missing', entry: null };
}

function planMissingHolds(cells, attachable) {
    for (let view of HOLD_VIEWS) {
        let missing = HOLD_HANDS.map(hand => holdCellKey(view, hand)).filter(cell => cells[cell].status === 'missing');
        if (!missing.length) continue;
        let name = getPlannedHoldName(view);
        let used = HOLD_CELLS.some(cell => cells[cell].animation === name && !missing.includes(cell));
        if (used) name = `animation.${getHoldStem()}.${view}_hold_${missing.length === 1 ? missing[0].split('.')[1] : 'both'}`;
        for (let cell of missing) {
            Object.assign(cells[cell], { status: attachable ? 'missing' : 'new', animation: name, short: null, plays: missing.slice(), condition: null });
        }
    }
}

function readSavedHoldCells() {
    let link = Project ? getProjectData().holds.link : null;
    if (!link) return null;
    let cells = {};
    for (let cell of HOLD_CELLS) {
        let saved = link.cells[cell];
        if (!saved || !findHoldAnimation(saved.animation)) return null;
        cells[cell] = { status: 'linked', animation: saved.animation, short: null, plays: saved.plays.filter(entry => HOLD_CELLS.includes(entry)), condition: null };
    }
    return cells;
}

function rememberHoldCells(cells) {
    let link = { cells: {} };
    for (let cell of HOLD_CELLS) {
        if (cells[cell].status !== 'linked' || !cells[cell].animation) return;
        link.cells[cell] = { animation: cells[cell].animation, plays: cells[cell].plays.slice() };
    }
    let holds = getProjectData().holds;
    if (JSON.stringify(holds.link) !== JSON.stringify(link)) holds.link = link;
}

function analyseHolds() {
    let bone = findHoldBone();
    let attachable = readHoldAttachable();
    let entries = attachable ? readAnimateEntries(attachable.description) : [];
    let cells = {};
    for (let cell of HOLD_CELLS) {
        let choice = chooseHoldEntry(cell, entries, bone);
        let entry = choice.entry;
        cells[cell] = {
            status: choice.status,
            animation: entry ? entry.id : null,
            short: entry ? entry.short : null,
            plays: entry ? entry.cells.slice() : [],
            condition: entry ? entry.condition : null
        };
    }
    let source = attachable ? attachable.source : 'none';
    if (!attachable) {
        let saved = readSavedHoldCells();
        if (saved) {
            cells = saved;
            source = 'project';
        }
    }
    planMissingHolds(cells, attachable);
    if (attachable) rememberHoldCells(cells);
    let files = getLinkedAnimationFiles();
    for (let cell of HOLD_CELLS) {
        let animation = findHoldAnimation(cells[cell].animation);
        cells[cell].loaded = !!animation;
        cells[cell].file = (animation && animation.path) || files[cells[cell].animation] || null;
    }
    return {
        source,
        attachable: attachable ? { path: attachable.path, identifier: readAttachableIdentifier(attachable.description) } : null,
        bone: bone ? { name: bone.name, uuid: bone.uuid, binding: bone.binding, bound: bone.bound, pivot: bone.pivot, rotated: bone.rotated } : null,
        entries: entries.map(entry => ({ short: entry.short, id: entry.id, condition: entry.condition, cells: entry.cells, controller: entry.controller })),
        cells
    };
}

function readAttachableIdentifier(description) {
    return typeof description.identifier === 'string' ? description.identifier : null;
}

// =========================
// The hold files on disk (read only)
// =========================
const HOLD_TIME_EPSILON = 0.0001;
const HOLD_NUMBER_TEXT = /^\s*-?(?:\d+\.?\d*|\.\d+)(?:e[+-]?\d+)?\s*$/i;

let holdFileCache = new Map();

function forgetHoldFiles() {
    holdFileCache = new Map();
}

function getHoldFileKey(path) {
    return String(path).replace(/\\/g, '/').toLowerCase();
}

function parseHoldFileJson(text) {
    try {
        let json = autoParseJSON(text, false);
        return isPlainObject(json) ? json : null;
    } catch (error) {
        return null;
    }
}

function readHoldFile(path, force = false) {
    if (typeof path !== 'string' || !path) return null;
    let key = getHoldFileKey(path);
    if (!force && holdFileCache.has(key)) return holdFileCache.get(key);
    let text = readPackTextFile(path);
    let entry = typeof text === 'string' ? { path, text, hash: fnv1aHex(text), json: parseHoldFileJson(text) } : null;
    holdFileCache.set(key, entry);
    return entry;
}

function readHoldNumberText(value) {
    return typeof value === 'string' && HOLD_NUMBER_TEXT.test(value) ? parseFloat(value) : value;
}

function findFileHoldBone(bones, boneName) {
    if (!isPlainObject(bones) || !boneName) return null;
    let wanted = String(boneName).toLowerCase();
    let key = Object.keys(bones).find(name => name.toLowerCase() === wanted);
    return key ? bones[key] : null;
}

function readFileHoldChannelTables(value, channel) {
    if (value === undefined) return getHoldIdentity(channel).map(entry => fillHoldTable(() => entry));
    let vector = value;
    if (isPlainObject(value)) {
        let keys = Object.keys(value);
        if (keys.length !== 1 || !(Math.abs(parseFloat(keys[0])) < HOLD_TIME_EPSILON)) return null;
        vector = value[keys[0]];
    }
    if (!Array.isArray(vector)) vector = [vector, vector, vector];
    if (vector.length !== 3) return null;
    let tables = vector.map(entry => readHoldMolangTable(readHoldNumberText(entry)));
    return tables.every(Boolean) ? tables : null;
}

function readFileHoldBone(file, animationName, boneName) {
    let animations = file && file.json && isPlainObject(file.json.animations) ? file.json.animations : null;
    let animation = animations && isPlainObject(animations[animationName]) ? animations[animationName] : null;
    if (!animation) return { animation: false, bone: null };
    return { animation: true, bone: findFileHoldBone(animation.bones, boneName) };
}

function readFileHoldPose(file, cellInfo, boneName, cell) {
    if (!file || !cellInfo || !cellInfo.animation) return null;
    let found = readFileHoldBone(file, cellInfo.animation, boneName);
    if (!found.animation) return null;
    let pose = {};
    for (let channel of HOLD_CHANNELS) {
        let tables = readFileChannelTablesOfBone(found.bone, channel);
        if (!tables) return null;
        pose[channel] = tables.map(table => roundHoldNumber(table[cell]));
    }
    return pose;
}

function readFileChannelTablesOfBone(bone, channel) {
    return readFileHoldChannelTables(isPlainObject(bone) ? bone[channel] : undefined, channel);
}

function readLinkedFilePose(link, cell, force = false) {
    let cellInfo = link && link.cells[cell];
    if (!cellInfo || !cellInfo.file || !link.bone) return null;
    return readFileHoldPose(readHoldFile(cellInfo.file, force), cellInfo, link.bone.name, cell);
}

// =========================
// Loading the hold animations
// =========================
function loadHoldAnimationsFromFiles(ids) {
    let files = getLinkedAnimationFiles();
    let byPath = new Map();
    for (let id of ids) {
        let path = files[id];
        if (!path || findHoldAnimation(id)) continue;
        if (!byPath.has(path)) byPath.set(path, []);
        byPath.get(path).push(id);
    }
    let codec = typeof AnimationCodec !== 'undefined' && AnimationCodec.codecs ? AnimationCodec.codecs.bedrock : null;
    let loaded = [];
    if (!codec || typeof codec.loadFile !== 'function') return loaded;
    for (let [path, names] of byPath) {
        let content = readPackTextFile(path);
        if (typeof content !== 'string') continue;
        try {
            for (let animation of codec.loadFile({ path, content }, names) || []) loaded.push(animation.name);
        } catch (error) {
            console.warn(LOG_PREFIX, 'Could not read the hold animations:', error);
        }
    }
    return loaded;
}

function ensureHoldAnimationsLoaded() {
    if (!Project || getRoute() !== 'attachable' || !isEntityFormat()) return false;
    let changed = false;
    let manager = Project.BedrockEntityManager;
    if (manager && manager.client_entity && !manager.initialized_animations && typeof manager.initAnimations === 'function') {
        try {
            manager.initAnimations();
            changed = true;
        } catch (error) {
            console.warn(LOG_PREFIX, 'Could not load the animations of this attachable:', error);
        }
    }
    let attachable = readHoldAttachable();
    let ids = attachable ? readAnimateEntries(attachable.description).filter(entry => !entry.controller).map(entry => entry.id) : [];
    if (loadHoldAnimationsFromFiles(ids).length) changed = true;
    return changed;
}

// =========================
// Rig check
// =========================
const HOLD_FAR_FROM_HAND = 12;
const HOLD_BINDING = 'q.item_slot_to_bone_name(c.item_slot)';

function measureHoldReach(values, bone) {
    let reach = [0, 1, 2].map(axis => bone.pivot[axis] - BOUND_ROOT_ANCHOR[axis] + values.position[axis]);
    return Math.hypot(reach[0], reach[1], reach[2]);
}

function runHoldRigChecks(readValues) {
    if (!Project || getRoute() !== 'attachable') return [];
    let checks = [];
    let roots = Outliner.root.filter(node => node instanceof Group);
    let looseCubes = Outliner.root.filter(node => !(node instanceof Group) && node.export !== false);
    let bound = roots.filter(isHandBoundGroup);
    if (!bound.length) {
        let target = roots.length === 1 ? roots[0] : null;
        checks.push({
            id: 'no_hand_binding',
            severity: 'error',
            values: { bone: target ? target.name : '' },
            fix: target && !target.bedrock_binding ? 'bind_root' : null,
            approximate: false
        });
        return checks;
    }
    let main = bound[0];
    let others = roots.filter(group => group !== main && !isHandBoundGroup(group)).map(group => group.name).concat(looseCubes.map(node => node.name));
    if (others.length) {
        let canMove = (!Array.isArray(main.rotation) || main.rotation.every(angle => angle === 0)) && roots.filter(group => group !== main).every(group => !isHandBoundGroup(group));
        checks.push({
            id: 'loose_roots',
            severity: 'warning',
            values: { bone: main.name, others: others.join(', ') },
            fix: canMove ? 'move_into_bound' : null,
            approximate: false
        });
    }
    let bone = findHoldBone();
    if (bone && bone.bound && typeof readValues === 'function') {
        for (let view of HOLD_VIEWS) {
            let values = readValues(findHoldSlotId(view, 'main_hand'));
            if (!values) continue;
            let reach = measureHoldReach(values, bone);
            if (reach <= HOLD_FAR_FROM_HAND) continue;
            checks.push({
                id: `far_from_hand.${view}`,
                severity: 'info',
                values: { bone: bone.name, view, distance: String(Math.round(reach * 10) / 10) },
                fix: null,
                approximate: true
            });
        }
    }
    return checks;
}

function fixHoldBinding() {
    let roots = Outliner.root.filter(node => node instanceof Group);
    let target = roots.length === 1 ? roots[0] : null;
    if (!target || target.bedrock_binding || roots.some(isHandBoundGroup)) return false;
    Undo.initEdit({ groups: [target] });
    target.bedrock_binding = HOLD_BINDING;
    Undo.finishEdit(i18n('display_sensei.undo.hold_bind_root'));
    return true;
}

function fixLooseHoldRoots() {
    let roots = Outliner.root.filter(node => node instanceof Group);
    let main = roots.find(isHandBoundGroup);
    if (!main || (Array.isArray(main.rotation) && main.rotation.some(angle => angle !== 0))) return false;
    let moving = Outliner.root.filter(node => node !== main && (!(node instanceof Group) || !isHandBoundGroup(node)) && node.export !== false);
    if (!moving.length) return false;
    Undo.initEdit({ outliner: true });
    for (let node of moving) node.addTo(main);
    Canvas.updateAllBones();
    Canvas.updateAllPositions();
    Undo.finishEdit(i18n('display_sensei.undo.hold_move_into_bone'), { outliner: true });
    return true;
}

function applyHoldRigFix(fixId) {
    if (!Project || getRoute() !== 'attachable' || Undo.current_save || Modes.animate) return false;
    if (fixId === 'bind_root') return fixHoldBinding();
    if (fixId === 'move_into_bound') return fixLooseHoldRoots();
    return false;
}

// ---- src/attachable_hold.js ----

// =========================
// Held 3D items: holds (back end)
// =========================

// =========================
// Values
// =========================
const HOLD_RANGES = Object.freeze({
    position: Object.freeze([-128, 128]),
    rotation: Object.freeze([-360, 360]),
    scale: Object.freeze([-16, 16])
});

const HOLD_READ_ONLY_STATUSES = ['stacked', 'controller'];

function sanitizeHoldValue(channel, value) {
    let number = typeof value === 'number' ? value : parseFloat(value);
    if (!Number.isFinite(number) || !HOLD_RANGES[channel]) return null;
    if (channel === 'rotation') return roundHoldNumber(wrapAngle(number));
    return roundHoldNumber(clampToRange(number, HOLD_RANGES[channel]));
}

function readKeyframeFileValue(keyframe, channel, axis) {
    let point = keyframe.data_points[0];
    let raw = point ? point[HOLD_AXIS_LETTERS[axis]] : undefined;
    if (raw === undefined || raw === null || raw === '') return getHoldIdentity(channel)[axis];
    raw = readHoldNumberText(raw);
    if (!isHoldAxisFlipped(channel, axis)) return raw;
    return typeof raw === 'number' ? -raw : invertMolang(String(raw));
}

function toBlockbenchHoldValue(channel, axis, expression) {
    if (!isHoldAxisFlipped(channel, axis)) return expression;
    return typeof expression === 'number' ? roundHoldNumber(-expression) : invertMolang(expression);
}

function readShownTables(keyframe, channel) {
    return [0, 1, 2].map(axis => {
        let value = getHoldIdentity(channel)[axis];
        try {
            let calculated = keyframe.calc(HOLD_AXIS_LETTERS[axis], 0);
            if (Number.isFinite(calculated)) value = isHoldAxisFlipped(channel, axis) ? -calculated : calculated;
        } catch (error) {
            console.warn(LOG_PREFIX, 'Could not read a hold value:', error);
        }
        return fillHoldTable(() => roundHoldNumber(value));
    });
}

function readHoldChannel(animator, channel) {
    let keyframes = animator && Array.isArray(animator[channel]) ? animator[channel] : [];
    if (!keyframes.length) {
        return { tables: getHoldIdentity(channel).map(value => fillHoldTable(() => value)), editable: true, keyframe: null, reason: null };
    }
    let keyframe = keyframes[0];
    let single = keyframes.length === 1 && Math.abs(keyframe.time) < HOLD_TIME_EPSILON && keyframe.data_points.length === 1;
    if (single) {
        let tables = [0, 1, 2].map(axis => readHoldMolangTable(readKeyframeFileValue(keyframe, channel, axis)));
        if (tables.every(Boolean)) return { tables, editable: true, keyframe, reason: null };
    }
    return { tables: readShownTables(keyframe, channel), editable: false, keyframe, reason: single ? 'molang' : 'animated' };
}

function readHoldCellValues(link, cell) {
    let info = link.cells[cell];
    let result = { values: cloneJson(HOLD_IDENTITY), editable: {}, reason: null };
    let readOnly = HOLD_READ_ONLY_STATUSES.includes(info.status) || !link.bone;
    let animator = readOnly ? null : findHoldAnimator(findHoldAnimation(info.animation), link.bone);
    for (let channel of HOLD_CHANNELS) {
        let read = readHoldChannel(animator, channel);
        result.values[channel] = read.tables.map(table => roundHoldNumber(table[cell]));
        result.editable[channel] = !readOnly && read.editable;
        if (!result.reason && read.reason) result.reason = read.reason;
    }
    if (readOnly) result.reason = link.bone ? info.status : 'no_bone';
    return result;
}

// =========================
// Rotations (Bedrock bones turn Z, then Y, then X)
// =========================
function holdRotationQuaternion(rotation) {
    let turned = toBlockbenchRotation(rotation);
    return new THREE.Quaternion().setFromEuler(new THREE.Euler(turned[0] * DEGREES, turned[1] * DEGREES, turned[2] * DEGREES, 'ZYX'));
}

function readHoldEulerAngles(quaternion) {
    let e = new THREE.Matrix4().makeRotationFromQuaternion(quaternion).elements;
    let toDegrees = 180 / Math.PI;
    let cosY = Math.hypot(e[0], e[1]);
    if (cosY < GIMBAL_EPSILON) {
        let side = -e[2] >= 0 ? 1 : -1;
        return [Math.atan2(side * e[4], e[5]) * toDegrees, side * 90, 0].map(wrapAngle);
    }
    let first = [Math.atan2(e[6], e[10]), Math.atan2(-e[2], cosY), Math.atan2(e[1], e[0])].map(angle => wrapAngle(angle * toDegrees));
    let second = [first[0] + 180, 180 - first[1], first[2] + 180].map(wrapAngle);
    let size = angles => angles.reduce((sum, angle) => sum + Math.abs(angle), 0);
    return size(second) < size(first) - VALUE_EPSILON ? second : first;
}

function foldHoldGimbal(angles) {
    let side = Math.sign(angles[1]);
    let change = Math.abs(Math.abs(angles[1]) - 90);
    if (!side || change > NEAR_GIMBAL_DEGREES) return null;
    return { angles: [wrapAngle(angles[0] - side * angles[2]), side * 90, 0], change: roundHoldNumber(change) };
}

function holdRotationFromQuaternion(quaternion, fold = true) {
    let angles = readHoldEulerAngles(quaternion);
    let folded = fold ? foldHoldGimbal(angles) : null;
    if (folded) angles = folded.angles;
    return { rotation: toBlockbenchRotation(angles).map(value => sanitizeHoldValue('rotation', value) + 0), change: folded ? folded.change : 0 };
}

function holdMatrix(values) {
    let position = toBlockbenchPosition(values.position);
    let scale = values.scale.map(value => (Math.abs(value) < 0.0001 ? 0.0001 : value));
    return new THREE.Matrix4().compose(new THREE.Vector3().fromArray(position), holdRotationQuaternion(values.rotation), new THREE.Vector3().fromArray(scale));
}

function holdValuesFromMatrix(matrix) {
    let position = new THREE.Vector3();
    let quaternion = new THREE.Quaternion();
    let scale = new THREE.Vector3();
    matrix.decompose(position, quaternion, scale);
    let turned = holdRotationFromQuaternion(quaternion);
    let values = {
        position: toBlockbenchPosition(position.toArray()).map(value => sanitizeHoldValue('position', value) + 0),
        rotation: turned.rotation,
        scale: scale.toArray().map(value => sanitizeHoldValue('scale', value) + 0)
    };
    let clamped = position.toArray().some(value => Math.abs(value) > HOLD_RANGES.position[1]) ||
        scale.toArray().some(value => Math.abs(value) > HOLD_RANGES.scale[1]);
    return { values, clamped, turned: turned.change };
}

function mirrorHoldValues(values) {
    return {
        position: [-values.position[0], values.position[1], values.position[2]].map(value => value + 0),
        rotation: [values.rotation[0], -values.rotation[1], -values.rotation[2]].map(value => value + 0),
        scale: values.scale.slice()
    };
}

function getHoldGimbal(rotation) {
    let angles = toBlockbenchRotation(rotation);
    let folded = foldHoldGimbal(angles);
    if (!folded) return null;
    let tidy = toBlockbenchRotation(folded.angles).map(value => value + 0);
    let same = tidy.every((value, axis) => sameAngle(value, rotation[axis]));
    return { y: tidy[1], change: folded.change, tidy: same ? null : tidy };
}

// =========================
// What the panel reads
// =========================
function getOffHandMode(link, view) {
    let main = link.cells[holdCellKey(view, 'main_hand')];
    let off = link.cells[holdCellKey(view, 'off_hand')];
    if (!main.animation || main.animation !== off.animation || HOLD_READ_ONLY_STATUSES.includes(main.status)) return 'separate';
    if (getProjectData().holds.off_hand[view] === 'own') return 'own';
    let mainValues = readHoldCellValues(link, holdCellKey(view, 'main_hand')).values;
    let offValues = readHoldCellValues(link, holdCellKey(view, 'off_hand')).values;
    return JSON.stringify(mainValues) === JSON.stringify(offValues) ? 'same' : 'own';
}

function buildHoldState(link, slot) {
    let info = link.cells[slot.cell];
    let read = readHoldCellValues(link, slot.cell);
    let offHand = getOffHandMode(link, slot.view);
    return {
        id: slot.slotId,
        view: slot.view,
        hand: slot.hand,
        cell: slot.cell,
        values: read.values,
        editable: read.editable,
        reason: read.reason,
        status: info.status,
        animation: info.animation,
        short: info.short,
        plays: info.plays.slice(),
        file: info.file || null,
        bone: link.bone ? link.bone.name : null,
        offHand,
        sameAsMain: slot.hand === 'off_hand' && offHand === 'same',
        gimbal: getHoldGimbal(read.values.rotation),
        editing: canEditAttachable()
    };
}

function getHoldState(slotId) {
    let slot = findHoldSlot(slotId);
    if (!slot || !Project || getRoute() !== 'attachable') return null;
    return buildHoldState(analyseHolds(), slot);
}

function getHoldValues(slotId) {
    let state = getHoldState(slotId);
    return state ? state.values : null;
}

function getHoldPose(slotId) {
    let slot = findHoldSlot(slotId);
    if (!slot || !Project || getRoute() !== 'attachable') return null;
    let link = analyseHolds();
    if (!link.bone) return null;
    return { bone: link.bone, values: readHoldCellValues(link, slot.cell).values };
}

function getHoldWearState(project = Project) {
    if (!project || getRoute() !== 'attachable') return { worn: false, slot: null };
    let wear = getWearInfo(project);
    let slot = wear.slot || (Array.isArray(wear.slots) ? wear.slots[0] : null) || null;
    let worn = wear.kind === 'armor' || (wear.kind === 'worn' && isArmorSlotId(slot));
    return { worn, slot: worn && isArmorSlotId(slot) ? slot : null };
}

function prepareHoldEditing() {
    if (!Project || getRoute() !== 'attachable') return false;
    ensureHoldAnimationsLoaded();
    noteHoldFilesSeen(analyseHolds());
    return true;
}

function getHoldOverview() {
    if (!Project || getRoute() !== 'attachable') return null;
    let link = analyseHolds();
    return {
        source: link.source,
        attachable: link.attachable,
        bone: link.bone,
        cells: cloneJson(link.cells),
        checks: runHoldRigChecks(getHoldValues),
        editing: canEditAttachable()
    };
}

// =========================
// Writing into the keyframes
// =========================
function createHoldAnimation(name) {
    let animation = new Animation({ name, loop: 'loop', saved: false });
    animation.add(false);
    if (openHoldEdit && openHoldEdit.project === Project) openHoldEdit.created.push(animation);
    return animation;
}

function setHoldKeyframe(animator, channel, keyframe, expressions) {
    let points = expressions.map((expression, axis) => toBlockbenchHoldValue(channel, axis, expression));
    if (!keyframe) {
        animator.addKeyframe({ channel, time: 0, uniform: false, data_points: [{ x: points[0], y: points[1], z: points[2] }] });
        return;
    }
    if (keyframe.uniform && !points.every(point => String(point) === String(points[0]))) keyframe.uniform = false;
    HOLD_AXIS_LETTERS.forEach((letter, axis) => keyframe.set(letter, points[axis]));
}

function writeHoldValues(link, slot, channel, axisValues, options = {}) {
    let info = link.cells[slot.cell];
    let bone = findHoldBone();
    if (!bone || !info.animation || HOLD_READ_ONLY_STATUSES.includes(info.status)) return false;
    let animation = findHoldAnimation(info.animation);
    let existing = animation ? findHoldAnimator(animation, bone) : null;
    let read = readHoldChannel(existing, channel);
    if (!read.editable) return false;
    let mode = options.mode || getOffHandMode(link, slot.view);
    let cells = [slot.cell];
    if (slot.hand === 'main_hand' && mode === 'same') cells.push(holdCellKey(slot.view, 'off_hand'));
    let tables = read.tables.map((table, axis) => {
        let value = axisValues[axis];
        if (value === null || value === undefined) return table;
        let next = Object.assign({}, table);
        for (let cell of cells) next[cell] = value;
        return next;
    });
    if (tables.every((table, axis) => sameHoldTables(table, read.tables[axis], info.plays))) return false;
    if (!animation) animation = createHoldAnimation(info.animation);
    let animator = findHoldAnimator(animation, bone) || animation.getBoneAnimator(bone.group);
    setHoldKeyframe(animator, channel, read.keyframe, tables.map(table => composeHoldMolang(table, info.plays)));
    if (slot.hand === 'off_hand' && mode === 'same' && !options.keepMode) getProjectData().holds.off_hand[slot.view] = 'own';
    return true;
}

function writeHoldPose(link, slot, values, options = {}) {
    let changed = false;
    let mode = options.mode || getOffHandMode(link, slot.view);
    for (let channel of HOLD_CHANNELS) {
        if (!values[channel]) continue;
        let clean = values[channel].map(value => sanitizeHoldValue(channel, value));
        if (writeHoldValues(analyseHolds(), slot, channel, clean, Object.assign({}, options, { mode }))) changed = true;
    }
    return changed;
}

// =========================
// Undo steps
// =========================
let openHoldEdit = null;

function getHoldAnimationsForUndo() {
    let link = analyseHolds();
    let names = [];
    for (let cell of HOLD_CELLS) {
        let name = link.cells[cell].animation;
        if (name && !names.includes(name)) names.push(name);
    }
    return names.map(findHoldAnimation).filter(Boolean);
}

function readHoldSignature() {
    let link = analyseHolds();
    let holds = getProjectData().holds;
    return JSON.stringify({
        cells: HOLD_CELLS.map(cell => readHoldCellValues(link, cell).values),
        off_hand: holds.off_hand,
        start: holds.start
    });
}

function isOwnHoldEditOpen() {
    return !!openHoldEdit && openHoldEdit.project === Project && !!Project && Undo.current_save === openHoldEdit.save;
}

function beginHoldEdit() {
    if (!canEditAttachable()) return false;
    if (isOwnHoldEditOpen()) return true;
    if (Undo.current_save) return false;
    let before = readHoldSignature();
    let save = Undo.initEdit({ animations: getHoldAnimationsForUndo(), [PROJECT_DATA_UNDO_ASPECT]: true });
    openHoldEdit = { save, project: Project, created: [], before };
    return true;
}

function takeOpenHoldEdit() {
    let edit = openHoldEdit;
    openHoldEdit = null;
    if (!edit || edit.project.undo.current_save !== edit.save) return null;
    if (edit.project !== Project) {
        edit.project.undo.cancelEdit(false);
        return null;
    }
    return edit;
}

function removeCreatedHoldAnimations(edit) {
    for (let animation of edit.created) {
        if (Animation.all.includes(animation)) animation.remove(false, false);
    }
}

function finishHoldEdit(label) {
    let edit = takeOpenHoldEdit();
    if (!edit) return false;
    if (readHoldSignature() === edit.before) {
        Undo.cancelEdit(false);
        removeCreatedHoldAnimations(edit);
        refreshHoldPreview();
        return false;
    }
    Undo.finishEdit(label || i18n('display_sensei.undo.hold_edit'), { animations: getHoldAnimationsForUndo(), [PROJECT_DATA_UNDO_ASPECT]: true });
    refreshHoldPreview();
    return true;
}

function cancelHoldEdit() {
    let edit = takeOpenHoldEdit();
    if (!edit) return false;
    Undo.cancelEdit(true);
    removeCreatedHoldAnimations(edit);
    refreshHoldPreview();
    return true;
}

function runHoldEdit(label, change) {
    if (!canEditAttachable()) return false;
    let result;
    if (isOwnHoldEditOpen()) {
        result = change();
    } else {
        if (Undo.current_save || !beginHoldEdit()) return false;
        try {
            result = change();
        } catch (error) {
            cancelHoldEdit();
            throw error;
        }
        finishHoldEdit(label);
    }
    refreshHoldPreview();
    return result !== false;
}

function refreshHoldPreview() {
    refreshArmorPreviewSafely();
    refreshPanelSafely();
}

// =========================
// Editing
// =========================
function setHoldChannel(slotId, channel, values, label = null) {
    let slot = findHoldSlot(slotId);
    if (!slot || !HOLD_CHANNELS.includes(channel) || !Array.isArray(values)) return false;
    let clean = [0, 1, 2].map(axis => (values[axis] === null || values[axis] === undefined ? null : sanitizeHoldValue(channel, values[axis])));
    if (clean.every(value => value === null)) return false;
    return runHoldEdit(label || i18n('display_sensei.undo.hold_edit'), () => writeHoldValues(analyseHolds(), slot, channel, clean));
}

function setHoldAxis(slotId, channel, axis, value) {
    if (![0, 1, 2].includes(axis)) return false;
    let values = [null, null, null];
    values[axis] = value;
    return setHoldChannel(slotId, channel, values);
}

function getHoldChannelDefault(slotId, channel) {
    return findHoldSlot(slotId) && HOLD_CHANNELS.includes(channel) ? getHoldIdentity(channel) : null;
}

function resetHoldChannel(slotId, channel) {
    let values = getHoldChannelDefault(slotId, channel);
    return values ? setHoldChannel(slotId, channel, values, i18n('display_sensei.undo.hold_reset_channel')) : false;
}

function setHoldPose(slotId, values, label) {
    let slot = findHoldSlot(slotId);
    if (!slot || !values) return false;
    return runHoldEdit(label, () => writeHoldPose(analyseHolds(), slot, values));
}

function setHoldOffHandSame(view, same) {
    if (!HOLD_VIEWS.includes(view)) return false;
    let link = analyseHolds();
    if (getOffHandMode(link, view) === 'separate') return false;
    let label = i18n(same ? 'display_sensei.undo.hold_off_hand_same' : 'display_sensei.undo.hold_off_hand_own');
    return runHoldEdit(label, () => {
        let holds = getProjectData().holds;
        if (!same) {
            holds.off_hand[view] = 'own';
            return true;
        }
        delete holds.off_hand[view];
        let main = readHoldCellValues(analyseHolds(), holdCellKey(view, 'main_hand')).values;
        let slot = findHoldSlot(findHoldSlotId(view, 'off_hand'));
        writeHoldPose(analyseHolds(), slot, main, { mode: 'own', keepMode: true });
        return true;
    });
}

function copyHoldFromOtherHand(slotId, mirror) {
    let slot = findHoldSlot(slotId);
    if (!slot) return false;
    let link = analyseHolds();
    let values = readHoldCellValues(link, holdCellKey(slot.view, getOtherHoldHand(slot.hand))).values;
    if (mirror) values = mirrorHoldValues(values);
    let label = i18n(mirror ? 'display_sensei.undo.hold_mirror' : 'display_sensei.undo.hold_same_pose');
    return setHoldPose(slotId, values, label);
}

function turnHoldAboutItemAxis(slotId, axis, degrees, label = null) {
    let axisIndex = TURN_AXES.indexOf(axis);
    let amount = Number(degrees);
    let state = getHoldState(slotId);
    if (!state || axisIndex < 0 || !Number.isFinite(amount) || amount === 0 || !state.editable.rotation) return false;
    let turn = axisIndex === 2 ? amount : -amount;
    let axisVector = new THREE.Vector3().setComponent(axisIndex, 1);
    let rotation = holdRotationQuaternion(state.values.rotation).multiply(new THREE.Quaternion().setFromAxisAngle(axisVector, turn * DEGREES));
    let turned = holdRotationFromQuaternion(rotation, false).rotation;
    return setHoldChannel(slotId, 'rotation', turned, label || i18n('display_sensei.undo.hold_turn_item'));
}

function turnHold180(slotId, axis) {
    return turnHoldAboutItemAxis(slotId, axis, 180, i18n('display_sensei.undo.hold_turn'));
}

function getHoldGimbalState(slotId) {
    let state = getHoldState(slotId);
    return state ? state.gimbal : null;
}

function tidyHoldRotation(slotId) {
    let gimbal = getHoldGimbalState(slotId);
    if (!gimbal || !gimbal.tidy) return null;
    let done = setHoldChannel(slotId, 'rotation', gimbal.tidy, i18n('display_sensei.undo.hold_tidy_rotation'));
    return done ? { rotation: gimbal.tidy.slice(), change: gimbal.change } : null;
}

// =========================
// Copy and paste
// =========================
let copiedHoldValues = null;

function copyHoldValues(slotId) {
    let values = getHoldValues(slotId);
    if (!values) return false;
    copiedHoldValues = cloneJson(values);
    return true;
}

function hasCopiedHoldValues() {
    return !!copiedHoldValues;
}

function pasteHoldValues(slotId) {
    if (!copiedHoldValues) return false;
    return setHoldPose(slotId, copiedHoldValues, i18n('display_sensei.undo.hold_paste'));
}

// =========================
// Presets
// =========================
const HOLD_PRESET_GROUPS = [
    { id: 'file', label: 'display_sensei.hold_preset.group_file' },
    { id: 'item_wizard', label: 'display_sensei.hold_preset.group_item_wizard' },
    { id: 'vanilla', label: 'display_sensei.hold_preset.group_vanilla' }
];

const HOLD_PRESETS = [
    {
        id: 'item_wizard_item', group: 'item_wizard', label: 'display_sensei.hold_preset.item_wizard_item', note: 'display_sensei.hold_preset.item_wizard_item_note', pivot: [0, 0, 0],
        first_person: { position: [9, 18, 5], rotation: [90, 56, -32], scale: [1, 1, 1] },
        third_person: { position: [0.5, 19, -2.5], rotation: [25, 0, 0], scale: [0.85, 0.85, 0.85] }
    },
    {
        id: 'item_wizard_tool', group: 'item_wizard', label: 'display_sensei.hold_preset.item_wizard_tool', note: 'display_sensei.hold_preset.item_wizard_tool_note', pivot: [0, 0, 0],
        first_person: { position: [3, 23, 4], rotation: [66, 60, -60], scale: [1, 1, 1] },
        third_person: { position: [0.5, 22.5, -0.5], rotation: [90, 0, 0], scale: [1, 1, 1] }
    },
    {
        id: 'vanilla_spyglass', group: 'vanilla', label: 'display_sensei.hold_preset.vanilla_spyglass', note: 'display_sensei.hold_preset.vanilla_spyglass_note', pivot: [0, 0, 0],
        first_person: { position: [2, 25, -1], rotation: [58, -48, -44], scale: [1, 1, 1] },
        third_person: { position: [1, 22, 0], rotation: [0, -90, 0], scale: [1, 1, 1] }
    },
    {
        id: 'vanilla_trident', group: 'vanilla', label: 'display_sensei.hold_preset.vanilla_trident', note: 'display_sensei.hold_preset.vanilla_trident_note', pivot: [0, 24, 0],
        first_person: { position: [-7, -3, -2], rotation: [152, -9, 25], scale: [1, 1, 1] },
        third_person: { position: [1.5, -2.5, -10.5], rotation: [97, -1.5, -49], scale: [1, 1, 1] }
    }
];

const HOLD_FALLBACK_START_ID = 'item_wizard_tool';
const HOLD_FILE_PRESET_ID = 'file';

function findHoldPreset(presetId) {
    return HOLD_PRESETS.find(preset => preset.id === presetId) || null;
}

function adaptHoldPose(pose, fromPivot, toPivot) {
    return {
        position: pose.position.map((value, axis) => roundHoldNumber(value + fromPivot[axis] - toPivot[axis])),
        rotation: pose.rotation.slice(),
        scale: pose.scale.slice()
    };
}

function readFileHoldPair(link, hand = 'main_hand', force = false) {
    let pair = {};
    for (let view of HOLD_VIEWS) {
        pair[view] = readLinkedFilePose(link, holdCellKey(view, hand), force);
        if (!pair[view]) return null;
    }
    return pair;
}

function getHoldPresetChoices() {
    if (!Project || getRoute() !== 'attachable') return [];
    let link = analyseHolds();
    let choices = [];
    if (readFileHoldPair(link)) {
        choices.push({ id: HOLD_FILE_PRESET_ID, group: 'file', label: i18n('display_sensei.hold_preset.file'), note: i18n('display_sensei.hold_preset.file_note') });
    }
    for (let preset of HOLD_PRESETS) {
        choices.push({ id: preset.id, group: preset.group, label: i18n(preset.label), note: i18n(preset.note) });
    }
    return choices;
}

function resolveHoldPresetPoses(presetId, link, hand) {
    let bone = link.bone;
    if (!bone) return null;
    if (presetId === HOLD_FILE_PRESET_ID) return readFileHoldPair(link, hand, true);
    let preset = findHoldPreset(presetId);
    if (!preset) return null;
    let poses = {};
    for (let view of HOLD_VIEWS) poses[view] = adaptHoldPose(preset[view], preset.pivot, bone.pivot);
    return poses;
}

function applyHoldPreset(presetId, slotId, scope = 'view') {
    let slot = findHoldSlot(slotId);
    let link = slot ? analyseHolds() : null;
    let poses = link ? resolveHoldPresetPoses(presetId, link, slot.hand) : null;
    if (!poses) return false;
    let views = scope === 'both' ? HOLD_VIEWS : [slot.view];
    let label = i18n('display_sensei.undo.hold_preset');
    return runHoldEdit(label, () => {
        let changed = false;
        for (let view of views) {
            let target = findHoldSlot(findHoldSlotId(view, slot.hand));
            if (writeHoldPose(analyseHolds(), target, poses[view])) changed = true;
        }
        if (scope === 'both' && slot.hand === 'main_hand') {
            let holds = getProjectData().holds;
            let start = presetId === HOLD_FILE_PRESET_ID ? null : { pivot: link.bone.pivot.slice(), first_person: poses.first_person, third_person: poses.third_person, source: presetId };
            if (JSON.stringify(holds.start) !== JSON.stringify(start)) {
                holds.start = start;
                changed = true;
            }
        }
        return changed;
    });
}

// =========================
// Matching first person to third person
// =========================
function getHoldMatchStart(link) {
    let bone = link.bone;
    let start = getProjectData().holds.start;
    if (start) return { pair: adaptPair(start, start.pivot, bone.pivot), source: start.source || 'preset' };
    let file = readFileHoldPair(link, 'main_hand', true);
    if (file) return { pair: file, source: 'file' };
    let fallback = findHoldPreset(HOLD_FALLBACK_START_ID);
    return { pair: adaptPair(fallback, fallback.pivot, bone.pivot), source: HOLD_FALLBACK_START_ID };
}

function adaptPair(pair, fromPivot, toPivot) {
    let adapted = {};
    for (let view of HOLD_VIEWS) adapted[view] = adaptHoldPose(pair[view], fromPivot, toPivot);
    return adapted;
}

function sameHoldPose(a, b) {
    return HOLD_CHANNELS.every(channel => a[channel].every((value, axis) => (channel === 'rotation' ? sameAngle : sameNumber)(value, b[channel][axis])));
}

function computeHoldFirstPerson(start, thirdPerson) {
    let matrix = holdMatrix(start.first_person).multiply(holdMatrix(start.third_person).invert()).multiply(holdMatrix(thirdPerson));
    return holdValuesFromMatrix(matrix);
}

function matchHoldFirstPerson() {
    if (!canEditAttachable()) return null;
    let link = analyseHolds();
    if (!link.bone) return null;
    let start = getHoldMatchStart(link);
    let result = { written: [], kept: [], clamped: [], turned: 0, start: start.source, readOnly: [] };
    let matched = {};
    for (let hand of HOLD_HANDS) {
        let slotId = findHoldSlotId('first_person', hand);
        let first = readHoldCellValues(link, holdCellKey('first_person', hand));
        let third = readHoldCellValues(link, holdCellKey('third_person', hand));
        if (hand === 'off_hand' && getOffHandMode(link, 'first_person') === 'same') continue;
        if (!HOLD_CHANNELS.every(channel => first.editable[channel])) {
            result.readOnly.push(slotId);
            continue;
        }
        if (sameHoldPose(third.values, start.pair.third_person)) {
            result.kept.push(slotId);
            continue;
        }
        let match = computeHoldFirstPerson(start.pair, third.values);
        matched[slotId] = match.values;
        result.written.push(slotId);
        if (match.clamped) result.clamped.push(slotId);
        result.turned = Math.max(result.turned, match.turned);
    }
    if (!result.written.length) return result;
    runHoldEdit(i18n('display_sensei.undo.hold_match'), () => {
        let changed = false;
        for (let slotId of result.written) {
            if (writeHoldPose(analyseHolds(), findHoldSlot(slotId), matched[slotId])) changed = true;
        }
        return changed;
    });
    return result;
}

// =========================
// Install
// =========================
function installAttachableHold() {
    return {
        delete() {
            if (openHoldEdit && openHoldEdit.project && openHoldEdit.project.undo && openHoldEdit.project.undo.current_save === openHoldEdit.save) {
                openHoldEdit.project.undo.cancelEdit(false);
            }
            openHoldEdit = null;
            copiedHoldValues = null;
            forgetHoldFiles();
        }
    };
}

registerModuleInstaller('attachable_hold', installAttachableHold);

// ---- src/hold_writer.js ----

// =========================
// Held 3D items: writing the hold numbers (back end)
// =========================

// =========================
// Reading JSON text (positions only)
// =========================
function skipJsonGap(text, index) {
    while (index < text.length) {
        let char = text[index];
        if (char === ' ' || char === '\t' || char === '\n' || char === '\r' || char === '﻿') {
            index++;
        } else if (char === '/' && text[index + 1] === '/') {
            let end = text.indexOf('\n', index);
            index = end < 0 ? text.length : end + 1;
        } else if (char === '/' && text[index + 1] === '*') {
            let end = text.indexOf('*/', index + 2);
            if (end < 0) throw new Error('Unclosed comment');
            index = end + 2;
        } else {
            break;
        }
    }
    return index;
}

function scanJsonString(text, index) {
    if (text[index] !== '"') throw new Error(`Expected a string at ${index}`);
    for (let position = index + 1; position < text.length; position++) {
        if (text[position] === '\\') {
            position++;
        } else if (text[position] === '"') {
            return position + 1;
        }
    }
    throw new Error('Unclosed string');
}

function scanJsonValue(text, index) {
    let char = text[index];
    if (char === '"') return scanJsonString(text, index);
    if (char === '{' || char === '[') {
        let close = char === '{' ? '}' : ']';
        let position = skipJsonGap(text, index + 1);
        if (text[position] === close) return position + 1;
        while (position < text.length) {
            if (char === '{') {
                position = skipJsonGap(text, scanJsonString(text, position));
                if (text[position] !== ':') throw new Error(`Expected : at ${position}`);
                position = skipJsonGap(text, position + 1);
            }
            position = skipJsonGap(text, scanJsonValue(text, position));
            if (text[position] === ',') {
                position = skipJsonGap(text, position + 1);
            } else if (text[position] === close) {
                return position + 1;
            } else {
                throw new Error(`Expected , or ${close} at ${position}`);
            }
        }
        throw new Error('Unclosed value');
    }
    let match = /^[^\s,}\]/]+/.exec(text.slice(index, index + 64));
    if (!match) throw new Error(`Expected a value at ${index}`);
    return index + match[0].length;
}

function readJsonMembers(text, objectStart) {
    if (text[objectStart] !== '{') throw new Error(`Expected an object at ${objectStart}`);
    let members = [];
    let position = skipJsonGap(text, objectStart + 1);
    if (text[position] === '}') return { members, close: position };
    while (position < text.length) {
        let keyEnd = scanJsonString(text, position);
        let key = JSON.parse(text.slice(position, keyEnd));
        let colon = skipJsonGap(text, keyEnd);
        if (text[colon] !== ':') throw new Error(`Expected : at ${colon}`);
        let valueStart = skipJsonGap(text, colon + 1);
        let valueEnd = scanJsonValue(text, valueStart);
        members.push({ key, keyStart: position, valueStart, valueEnd });
        position = skipJsonGap(text, valueEnd);
        if (text[position] === ',') {
            position = skipJsonGap(text, position + 1);
        } else if (text[position] === '}') {
            return { members, close: position };
        } else {
            throw new Error(`Expected , or } at ${position}`);
        }
    }
    throw new Error('Unclosed object');
}

function findJsonRoot(text) {
    let start = skipJsonGap(text, 0);
    if (text[start] !== '{') throw new Error('The file is not a JSON object');
    return start;
}

// =========================
// Text style of the file
// =========================
function detectNewline(text) {
    return text.includes('\r\n') ? '\r\n' : '\n';
}

function readLineIndent(text, index) {
    let lineStart = text.lastIndexOf('\n', index - 1) + 1;
    let match = /^[ \t]*/.exec(text.slice(lineStart, index));
    return match ? match[0] : '';
}

function detectIndentUnit(text) {
    let match = /\n([ \t]+)"/.exec(text);
    return match ? match[1] : '\t';
}

function readArrayStyle(text, start, end) {
    let inner = text.slice(start + 1, end - 1);
    let numbers = inner.match(/-?\d+(?:\.\d+)?(?:e[+-]?\d+)?/gi) || [];
    return {
        padded: !/[\r\n]/.test(inner) && /^\s/.test(inner) && /\s$/.test(inner),
        separator: /,[ \t]/.test(inner) ? ', ' : ',',
        decimals: numbers.length > 0 && numbers.every(number => number.includes('.'))
    };
}

const DEFAULT_ARRAY_STYLE = Object.freeze({ padded: false, separator: ', ', decimals: false });

function formatHoldJsonNumber(value, decimals) {
    let text = String(roundHoldNumber(value));
    return decimals && !/[.e]/i.test(text) ? `${text}.0` : text;
}

function serializeHoldJsonEntry(entry, style) {
    return typeof entry === 'number' ? formatHoldJsonNumber(entry, style.decimals) : JSON.stringify(entry);
}

function serializeHoldChannelValue(value, style) {
    if (!Array.isArray(value)) return serializeHoldJsonEntry(value, style);
    let inner = value.map(entry => serializeHoldJsonEntry(entry, style)).join(style.separator);
    return style.padded ? `[ ${inner} ]` : `[${inner}]`;
}

function findArrayStyleIn(text, objectStart) {
    let { members } = readJsonMembers(text, objectStart);
    let array = members.find(member => text[member.valueStart] === '[');
    return array ? readArrayStyle(text, array.valueStart, array.valueEnd) : null;
}

function serializeNestedMember(path, valueText, indent, unit, newline) {
    let [head, ...rest] = path;
    if (!rest.length) return `${JSON.stringify(head.key)}: ${valueText}`;
    let inner = serializeNestedMember(rest, valueText, indent + unit, unit, newline);
    let loop = head.loop ? `"loop": true,${newline}${indent}${unit}` : '';
    return `${JSON.stringify(head.key)}: {${newline}${indent}${unit}${loop}${inner}${newline}${indent}}`;
}

function insertJsonMember(text, objectStart, path, valueText) {
    let { members, close } = readJsonMembers(text, objectStart);
    let newline = detectNewline(text);
    let unit = detectIndentUnit(text);
    if (members.length) {
        let first = members[0];
        let last = members[members.length - 1];
        if (!/[\r\n]/.test(text.slice(objectStart, first.keyStart))) {
            return text.slice(0, last.valueEnd) + `, ${serializeNestedMember(path, valueText, '', '', ' ')}` + text.slice(last.valueEnd);
        }
        let indent = readLineIndent(text, first.keyStart);
        let member = serializeNestedMember(path, valueText, indent, unit, newline);
        return text.slice(0, last.valueEnd) + `,${newline}${indent}${member}` + text.slice(last.valueEnd);
    }
    let outer = readLineIndent(text, objectStart);
    let indent = outer + unit;
    let member = serializeNestedMember(path, valueText, indent, unit, newline);
    return text.slice(0, objectStart + 1) + `${newline}${indent}${member}${newline}${outer}` + text.slice(close);
}

// =========================
// The patch (pure)
// =========================
function findJsonMember(text, objectStart, key, ignoreCase) {
    let { members } = readJsonMembers(text, objectStart);
    let wanted = ignoreCase ? String(key).toLowerCase() : key;
    return members.find(member => (ignoreCase ? member.key.toLowerCase() : member.key) === wanted) || null;
}

function applyHoldChange(text, change, report) {
    let steps = [
        { key: 'animations', ignoreCase: false },
        { key: change.animation, ignoreCase: false, loop: true },
        { key: 'bones', ignoreCase: false },
        { key: change.bone, ignoreCase: true },
        { key: change.channel, ignoreCase: false }
    ];
    let objectStart = findJsonRoot(text);
    for (let index = 0; index < steps.length; index++) {
        let step = steps[index];
        let member = findJsonMember(text, objectStart, step.key, step.ignoreCase);
        let last = index === steps.length - 1;
        if (!member) {
            let style = (last && findArrayStyleIn(text, objectStart)) || change.style || DEFAULT_ARRAY_STYLE;
            let valueText = serializeHoldChannelValue(change.value, style);
            text = insertJsonMember(text, objectStart, steps.slice(index), valueText);
            report.inserted.push(`${change.animation}/${change.bone}/${change.channel}`);
            return text;
        }
        if (last) {
            let old = text.slice(member.valueStart, member.valueEnd);
            let style = text[member.valueStart] === '[' ? readArrayStyle(text, member.valueStart, member.valueEnd) : (change.style || DEFAULT_ARRAY_STYLE);
            let value = change.value;
            let oldSingle = text[member.valueStart] !== '[' && text[member.valueStart] !== '{';
            if (oldSingle && Array.isArray(value) && value.every(entry => entry === value[0]) && change.channel === 'scale') value = value[0];
            let valueText = serializeHoldChannelValue(value, style);
            if (valueText !== old) {
                text = text.slice(0, member.valueStart) + valueText + text.slice(member.valueEnd);
                report.replaced.push(`${change.animation}/${change.bone}/${change.channel}`);
            }
            return text;
        }
        if (text[member.valueStart] !== '{') throw new Error(`${step.key} is not an object`);
        objectStart = member.valueStart;
    }
    return text;
}

function raiseAnimationFormatVersion(text, version, report) {
    let root = findJsonRoot(text);
    let member = findJsonMember(text, root, 'format_version', false);
    if (!member) {
        let raised = insertJsonMember(text, root, [{ key: 'format_version' }], JSON.stringify(version));
        report.version = version;
        return raised;
    }
    let current = text[member.valueStart] === '"' ? JSON.parse(text.slice(member.valueStart, member.valueEnd)) : String(text.slice(member.valueStart, member.valueEnd));
    if (isGeometryVersionString(current) && VersionUtil.compare(current, '>=', version)) return text;
    report.version = version;
    return text.slice(0, member.valueStart) + JSON.stringify(version) + text.slice(member.valueEnd);
}

function patchHoldAnimationFile(text, changes, options = {}) {
    let report = { replaced: [], inserted: [], version: null };
    let result = String(text);
    for (let change of changes) result = applyHoldChange(result, change, report);
    if (options.raiseVersion) result = raiseAnimationFormatVersion(result, options.raiseVersion, report);
    return { text: result, report };
}

// =========================
// What to write
// =========================
const HOLD_OFF_HAND_FILE_VERSION = '1.10.0';
const HOLD_NEW_FILE_VERSION = '1.8.0';

function collectHoldAnimations(link) {
    let animations = [];
    for (let cell of HOLD_CELLS) {
        let info = link.cells[cell];
        if (!info.animation || HOLD_READ_ONLY_STATUSES.includes(info.status)) continue;
        let entry = animations.find(item => item.name === info.animation);
        if (!entry) {
            entry = { name: info.animation, plays: info.plays.slice(), cells: [], file: info.file || null, status: info.status };
            animations.push(entry);
        }
        entry.cells.push(cell);
        if (!entry.file && info.file) entry.file = info.file;
    }
    return animations;
}

function chooseHoldTarget(entry, animations) {
    let target = getProjectData().holds.target;
    if (target) return target;
    if (entry.file) return entry.file;
    let other = animations.find(item => item.file);
    return other ? other.file : null;
}

function readProjectChannelValue(read, plays) {
    return read.tables.map(table => composeHoldMolang(table, plays));
}

function holdValueHasTernary(value) {
    return [].concat(value).some(entry => typeof entry === 'string' && /item_slot/.test(entry));
}

function planHoldWrites(link, readFile = path => readHoldFile(path, true)) {
    let readOnce = new Map();
    let readPlanFile = path => {
        let key = getHoldFileKey(path);
        if (!readOnce.has(key)) readOnce.set(key, readFile(path));
        return readOnce.get(key);
    };
    let animations = collectHoldAnimations(link);
    let files = new Map();
    let skipped = [];
    let noFile = [];
    for (let entry of animations) {
        let animation = findHoldAnimation(entry.name);
        let animator = animation && link.bone ? findHoldAnimator(animation, link.bone) : null;
        let path = chooseHoldTarget(entry, animations);
        let file = path ? readPlanFile(path) : null;
        let fileBone = file ? readFileHoldBone(file, entry.name, link.bone ? link.bone.name : null) : { animation: false, bone: null };
        let changes = [];
        for (let channel of HOLD_CHANNELS) {
            let read = readHoldChannel(animator, channel);
            if (!read.editable) {
                if (read.keyframe) skipped.push(`${entry.name}/${channel}`);
                continue;
            }
            let fileTables = fileBone.animation ? readFileChannelTablesOfBone(fileBone.bone, channel) : null;
            let same = fileTables && read.tables.every((table, axis) => sameHoldTables(table, fileTables[axis], entry.plays));
            if (same) continue;
            if (!fileBone.animation && read.tables.every((table, axis) => sameHoldTables(table, fillHoldTable(() => getHoldIdentity(channel)[axis]), entry.plays))) continue;
            changes.push({ animation: entry.name, bone: link.bone.name, channel, value: readProjectChannelValue(read, entry.plays) });
        }
        if (!changes.length) continue;
        if (!path) {
            noFile.push(entry.name);
            continue;
        }
        let key = getHoldFileKey(path);
        if (!files.has(key)) files.set(key, { key, path, file, changes: [], animations: [] });
        let plan = files.get(key);
        plan.changes.push(...changes);
        if (!plan.animations.includes(entry.name)) plan.animations.push(entry.name);
    }
    let plans = Array.from(files.values());
    for (let plan of plans) {
        plan.raiseVersion = plan.changes.some(change => holdValueHasTernary(change.value)) ? HOLD_OFF_HAND_FILE_VERSION : null;
    }
    return { files: plans, skipped, noFile };
}

// =========================
// Files Display Sensei knows
// =========================
function getHoldFileRecord(path) {
    let holds = getProjectData().holds;
    return holds.files[getHoldFileKey(path)] || null;
}

function recordHoldFile(path, changes) {
    let holds = getProjectData().holds;
    let key = getHoldFileKey(path);
    let record = holds.files[key] || { path, hash: null, backup: null, written: null, confirmed: false };
    Object.assign(record, changes, { path });
    holds.files[key] = record;
    return record;
}

function noteHoldFilesSeen(link) {
    if (!link) return;
    for (let entry of collectHoldAnimations(link)) {
        let path = entry.file;
        if (!path || getHoldFileRecord(path)) continue;
        let file = readHoldFile(path);
        if (file) recordHoldFile(path, { hash: file.hash });
    }
}

function listHoldFilePaths(link) {
    let paths = [];
    let add = path => {
        if (path && !paths.some(entry => getHoldFileKey(entry) === getHoldFileKey(path))) paths.push(path);
    };
    let animations = collectHoldAnimations(link);
    for (let entry of animations) add(chooseHoldTarget(entry, animations));
    for (let entry of animations) add(entry.file);
    return paths;
}

function getHoldWriteState(force = false) {
    if (!Project || getRoute() !== 'attachable') return null;
    let link = analyseHolds();
    let read = path => readHoldFile(path, force);
    let plan = planHoldWrites(link, read);
    let files = listHoldFilePaths(link).map(path => {
        let file = read(path);
        let record = getHoldFileRecord(path);
        let pending = plan.files.find(entry => entry.key === getHoldFileKey(path));
        let changedAfterWrite = !!record && !!record.written && !!file && file.hash !== record.written && !!pending && pending.changes.length > 0;
        let changedSinceRead = !!record && !!record.hash && !!file && file.hash !== record.hash;
        return {
            path,
            name: getFileBaseName(path),
            exists: !!file,
            readable: !!file && !!file.json,
            pending: pending ? pending.changes.length : 0,
            changedAfterWrite,
            changedSinceRead,
            hasBackup: !!record && typeof record.backup === 'string',
            written: !!record && !!record.written && !!file && file.hash === record.written,
            confirmed: !!record && record.confirmed
        };
    });
    let missing = HOLD_CELLS.filter(cell => link.cells[cell].status === 'missing' || link.cells[cell].status === 'new');
    return {
        files,
        pending: plan.files.reduce((sum, entry) => sum + entry.changes.length, 0),
        noFile: plan.noFile,
        skipped: plan.skipped,
        missing,
        attachable: link.attachable,
        target: getProjectData().holds.target,
        desktopOnly: !isDesktopApp()
    };
}

// =========================
// Dialogs
// =========================
function askHoldMessage(options) {
    return new Promise(resolve => {
        Blockbench.showMessageBox(options, (button, result) => resolve({ button, result }));
    });
}

function cleanDialogPath(path) {
    return String(path).replace(/`/g, '');
}

async function confirmHoldWrite(plans) {
    let unconfirmed = plans.filter(plan => {
        let record = getHoldFileRecord(plan.path);
        return !record || !record.confirmed;
    });
    if (!unconfirmed.length) return 'write';
    let paths = unconfirmed.map(plan => '`' + cleanDialogPath(plan.path) + '`').join('\n');
    let answer = await askHoldMessage({
        title: i18n('display_sensei.hold_write.confirm_title'),
        message: i18nFormat('display_sensei.hold_write.confirm_message', { paths }),
        icon: 'save',
        buttons: [i18n('display_sensei.hold_write.confirm_write'), i18n('display_sensei.hold_write.choose_file'), i18n('display_sensei.ui.cancel')],
        confirmIndex: 0,
        cancelIndex: 2
    });
    if (answer.button === 0) return 'write';
    if (answer.button === 1) return 'choose';
    return 'cancel';
}

async function askHoldConflict(plan) {
    let answer = await askHoldMessage({
        title: i18n('display_sensei.hold_write.conflict_title'),
        message: i18nFormat('display_sensei.hold_write.conflict_message', { path: '`' + cleanDialogPath(plan.path) + '`' }),
        icon: 'warning',
        buttons: [i18n('display_sensei.hold_write.conflict_overwrite'), i18n('display_sensei.hold_write.conflict_load'), i18n('display_sensei.ui.cancel')],
        confirmIndex: 0,
        cancelIndex: 2
    });
    if (answer.button === 0) return 'overwrite';
    if (answer.button === 1) return 'load';
    return 'cancel';
}

function pickHoldTargetFile(onPicked) {
    let link = analyseHolds();
    let start = listHoldFilePaths(link)[0] || (Project && Project.export_path) || '';
    Blockbench.import({
        resource_id: 'animation',
        extensions: ['json'],
        type: i18n('display_sensei.hold_write.file_type'),
        startpath: start ? PathModule.dirname(start) : undefined
    }, files => {
        let path = files && files[0] && files[0].path ? files[0].path : null;
        if (path) onPicked(path);
    });
}

function clearHoldTarget() {
    if (!Project || getRoute() !== 'attachable') return false;
    let holds = getProjectData().holds;
    if (!holds.target) return false;
    holds.target = null;
    return true;
}

// =========================
// Writing
// =========================
function writeTextFile(path, text) {
    Blockbench.writeFile(path, { content: text });
}

function markHoldAnimationsSaved(plan, text) {
    let json = parseHoldFileJson(text);
    let codec = typeof AnimationCodec !== 'undefined' && AnimationCodec.codecs ? AnimationCodec.codecs.bedrock : null;
    if (!json || !isPlainObject(json.animations) || !codec || typeof codec.compileAnimation !== 'function') return;
    for (let name of plan.animations) {
        let animation = findHoldAnimation(name);
        if (!animation || !isPlainObject(json.animations[name])) continue;
        let compiled = codec.compileAnimation(animation);
        if (sameAnimationJson(compiled, json.animations[name])) {
            animation.saved = true;
            if (!animation.path) animation.path = plan.path;
        }
    }
}

function normalizeAnimationJson(value) {
    if (Array.isArray(value)) return value.map(normalizeAnimationJson);
    if (isPlainObject(value)) {
        let keys = Object.keys(value).sort();
        let copy = {};
        for (let key of keys) copy[key.toLowerCase()] = normalizeAnimationJson(value[key]);
        return copy;
    }
    let number = readHoldNumberText(value);
    return typeof number === 'number' ? roundHoldNumber(number) : number;
}

function sameAnimationJson(a, b) {
    return JSON.stringify(normalizeAnimationJson(a)) === JSON.stringify(normalizeAnimationJson(b));
}

function applyHoldPlan(plan, baseText) {
    let patched = patchHoldAnimationFile(baseText, plan.changes, { raiseVersion: plan.raiseVersion });
    let record = getHoldFileRecord(plan.path);
    let backup = record && typeof record.backup === 'string' ? record.backup : baseText;
    writeTextFile(plan.path, patched.text);
    let hash = fnv1aHex(patched.text);
    recordHoldFile(plan.path, { hash, written: hash, backup, confirmed: true });
    holdFileCache.set(getHoldFileKey(plan.path), { path: plan.path, text: patched.text, hash, json: parseHoldFileJson(patched.text) });
    markHoldAnimationsSaved(plan, patched.text);
    return patched.report;
}

async function writeHoldDisplay(options = {}) {
    if (!Project || getRoute() !== 'attachable') return { status: 'unavailable' };
    if (!isDesktopApp()) return { status: 'desktop_only' };
    let project = Project;
    let plan = planHoldWrites(analyseHolds());
    if (!plan.files.length && !plan.noFile.length) return { status: 'nothing', skipped: plan.skipped };
    let choice = plan.files.length ? await confirmHoldWrite(plan.files) : 'choose';
    if (project !== Project) return { status: 'cancelled' };
    if (choice === 'cancel') return { status: 'cancelled' };
    if (choice === 'choose') {
        pickHoldTargetFile(path => {
            if (project !== Project) return;
            getProjectData().holds.target = path;
            recordHoldFile(path, { confirmed: true });
            writeHoldDisplay(options).then(result => {
                if (typeof options.onDone === 'function') options.onDone(result);
            }, error => console.warn(LOG_PREFIX, 'Write display failed:', error));
        });
        return { status: 'choosing' };
    }
    let written = [];
    for (let entry of plan.files) recordHoldFile(entry.path, { confirmed: true });
    for (let entry of plan.files) {
        let current = readHoldFile(entry.path, true);
        if (!current) return { status: 'missing_file', path: entry.path };
        if (!current.json) return { status: 'unreadable', path: entry.path };
        if (/�/.test(current.text)) return { status: 'unreadable', path: entry.path };
        let record = getHoldFileRecord(entry.path);
        if (record && record.hash && record.hash !== current.hash) {
            let answer = await askHoldConflict(entry);
            if (project !== Project || answer === 'cancel') return { status: 'cancelled', written };
            if (answer === 'load') {
                loadHoldFileValues();
                return { status: 'loaded', written };
            }
        }
        let fresh = planHoldWrites(analyseHolds(), path => readHoldFile(path, false)).files.find(item => item.key === entry.key);
        if (!fresh) continue;
        try {
            let report = applyHoldPlan(fresh, current.text);
            written.push({ path: entry.path, report });
        } catch (error) {
            console.warn(LOG_PREFIX, 'Could not write the hold animations:', error);
            return { status: 'failed', path: entry.path, written };
        }
    }
    refreshPanelSafely();
    return { status: 'written', written, skipped: plan.skipped, noFile: plan.noFile };
}

// =========================
// Restoring and loading
// =========================
async function restoreHoldFile(path) {
    let record = path ? getHoldFileRecord(path) : null;
    if (!record || typeof record.backup !== 'string') return { status: 'nothing' };
    let project = Project;
    let answer = await askHoldMessage({
        title: i18n('display_sensei.hold_write.restore_title'),
        message: i18nFormat('display_sensei.hold_write.restore_message', { path: '`' + cleanDialogPath(path) + '`' }),
        icon: 'restore',
        buttons: [i18n('display_sensei.hold_write.restore_confirm'), i18n('display_sensei.ui.cancel')],
        confirmIndex: 0,
        cancelIndex: 1
    });
    if (answer.button !== 0 || project !== Project) return { status: 'cancelled' };
    try {
        writeTextFile(path, record.backup);
    } catch (error) {
        console.warn(LOG_PREFIX, 'Could not restore the hold animations:', error);
        return { status: 'failed' };
    }
    let hash = fnv1aHex(record.backup);
    recordHoldFile(path, { hash, written: null });
    holdFileCache.set(getHoldFileKey(path), { path, text: record.backup, hash, json: parseHoldFileJson(record.backup) });
    refreshPanelSafely();
    return { status: 'restored' };
}

function loadHoldFileValues() {
    if (!canEditAttachable() || Undo.current_save) return false;
    let link = analyseHolds();
    let codec = typeof AnimationCodec !== 'undefined' && AnimationCodec.codecs ? AnimationCodec.codecs.bedrock : null;
    if (!codec || typeof codec.loadFile !== 'function') return false;
    let byPath = new Map();
    for (let entry of collectHoldAnimations(link)) {
        if (!entry.file) continue;
        let key = getHoldFileKey(entry.file);
        if (!byPath.has(key)) byPath.set(key, { path: entry.file, names: [] });
        byPath.get(key).names.push(entry.name);
    }
    if (!byPath.size) return false;
    let before = getHoldAnimationsForUndo();
    Undo.initEdit({ animations: before, [PROJECT_DATA_UNDO_ASPECT]: true });
    let loaded = [];
    try {
        for (let { path, names } of byPath.values()) {
            let file = readHoldFile(path, true);
            if (!file || !file.json) continue;
            let places = {};
            for (let existing of before.filter(item => names.includes(item.name))) {
                places[existing.name] = Animation.all.indexOf(existing);
                existing.remove(false, false);
            }
            let fresh = codec.loadFile({ path, content: file.text }, names) || [];
            for (let animation of fresh) {
                if (typeof places[animation.name] === 'number' && places[animation.name] >= 0) {
                    Animation.all.remove(animation);
                    Animation.all.splice(Math.min(places[animation.name], Animation.all.length), 0, animation);
                }
                loaded.push(animation);
            }
            recordHoldFile(path, { hash: file.hash, written: null });
        }
        getProjectData().holds.off_hand = {};
    } catch (error) {
        Undo.cancelEdit(true);
        throw error;
    }
    Undo.finishEdit(i18n('display_sensei.undo.hold_load_file'), { animations: getHoldAnimationsForUndo(), [PROJECT_DATA_UNDO_ASPECT]: true });
    refreshHoldPreview();
    refreshPanelSafely();
    return loaded.length > 0;
}

// =========================
// Copy and Export
// =========================
function buildHoldAnimationFile() {
    if (!Project || getRoute() !== 'attachable') return null;
    let link = analyseHolds();
    if (!link.bone) return null;
    let animations = {};
    let ternary = false;
    for (let entry of collectHoldAnimations(link)) {
        let animator = findHoldAnimator(findHoldAnimation(entry.name), link.bone);
        let bone = {};
        for (let channel of HOLD_CHANNELS) {
            let read = readHoldChannel(animator, channel);
            if (!read.editable) continue;
            let identity = read.tables.every((table, axis) => sameHoldTables(table, fillHoldTable(() => getHoldIdentity(channel)[axis]), entry.plays));
            if (identity) continue;
            let value = readProjectChannelValue(read, entry.plays);
            if (holdValueHasTernary(value)) ternary = true;
            bone[channel] = value;
        }
        animations[entry.name] = { loop: true, bones: { [link.bone.name]: bone } };
    }
    if (!Object.keys(animations).length) return null;
    return { format_version: ternary ? HOLD_OFF_HAND_FILE_VERSION : HOLD_NEW_FILE_VERSION, animations };
}

function buildHoldAnimationText() {
    let file = buildHoldAnimationFile();
    return file ? compileJSON(file) : '';
}

function buildAttachableHoldLines() {
    if (!Project || getRoute() !== 'attachable') return '';
    let link = analyseHolds();
    let missing = collectHoldAnimations(link).filter(entry => entry.status === 'missing' || entry.status === 'new');
    if (!missing.length) return '';
    let animations = {};
    let animate = [];
    for (let entry of missing) {
        let short = entry.name.split('.').pop();
        animations[short] = entry.name;
        let views = HOLD_VIEWS.filter(view => entry.plays.some(cell => cell.startsWith(view)));
        let condition = views.length === 2 ? null : (views[0] === 'first_person' ? 'c.is_first_person' : '!c.is_first_person');
        animate.push(condition ? { [short]: condition } : short);
    }
    return compileJSON({ animations, scripts: { animate } });
}

function exportHoldAnimationFile() {
    let text = buildHoldAnimationText();
    if (!text) return false;
    Blockbench.export({
        resource_id: 'animation',
        type: i18n('display_sensei.hold_write.file_type'),
        extensions: ['json'],
        name: `${getHoldStem()}.animation`,
        content: text
    });
    return true;
}

// ---- src/armor_preview.js ----

// =========================
// Armor preview (back end)
// =========================

// =========================
// State
// =========================
const ARMOR_OVERLAY_DEFAULTS = { show: false, outerLayer: true, otherSlots: 'none', flatTexture: null, xray: false };
const ARMOR_OTHER_SLOT_MODES = ['none', 'grey', 'flat'];

let armorWearerId = DEFAULT_WEARER_ID;
let armorOverlayOptions = Object.assign({}, ARMOR_OVERLAY_DEFAULTS);
let armorPreviewSlot = null;
let activeArmorPose = null;
let armorFitPreview = false;
let armorOverlay = null;
let placedArmorMeshes = [];
let armorCompileDepth = 0;
let savedArmorCamera = null;
let armorCameraView = null;

// =========================
// Wearers and options
// =========================
function getWearerChoices() {
    return WEARER_RIGS.map(rig => ({ id: rig.id, label: i18n(rig.label), textured: !!rig.texture }));
}

function getWearer() {
    return armorWearerId;
}

function getArmorWearerRig() {
    return findWearerRig(armorWearerId) || findWearerRig(DEFAULT_WEARER_ID);
}

function setWearer(id) {
    if (!findWearerRig(id)) return false;
    armorWearerId = id;
    if (activeArmorPose && !resolveArmorPose(id, activeArmorPose)) activeArmorPose = null;
    refreshArmorPreviewSafely();
    return true;
}

function getOverlayOptions() {
    return Object.assign({}, armorOverlayOptions);
}

function setOverlayOptions(partial) {
    let options = isPlainObject(partial) ? partial : {};
    for (let key of ['show', 'outerLayer', 'xray']) {
        if (typeof options[key] === 'boolean') armorOverlayOptions[key] = options[key];
    }
    if (ARMOR_OTHER_SLOT_MODES.includes(options.otherSlots)) armorOverlayOptions.otherSlots = options.otherSlots;
    if (options.flatTexture === null || typeof options.flatTexture === 'string') armorOverlayOptions.flatTexture = options.flatTexture;
    refreshArmorPreviewSafely();
    return getOverlayOptions();
}

function setArmorPreviewSlot(slotId) {
    let slot = isArmorSlotId(slotId) ? slotId : null;
    if (slot === armorPreviewSlot) return slot !== null;
    armorPreviewSlot = slot;
    refreshArmorPreviewSafely();
    return slot !== null;
}

function getArmorPreviewSlotId() {
    if (armorPreviewSlot) return armorPreviewSlot;
    let found = Project ? getWearInfo().slot : null;
    return isArmorSlotId(found) ? found : null;
}

function isArmorPreviewContext() {
    if (!Project || Project.multi_file_ruleset) return false;
    return getRoute() === 'attachable' && (Modes.edit || Modes.paint);
}

// =========================
// Box UV
// =========================
const ARMOR_FACE_ORDER = ['east', 'west', 'up', 'down', 'south', 'north'];

const BUNDLED_WEARER_TEXTURE_SIZE = [64, 64];

function getBoxUvFaces(size, offset, mirror = false) {
    let [x, y, z] = size.map(value => Math.floor(value + 0.0000001));
    let list = [
        { face: 'east', from: [0, z], size: [z, y] },
        { face: 'west', from: [z + x, z], size: [z, y] },
        { face: 'up', from: [z + x, z], size: [-x, -z] },
        { face: 'down', from: [z + x * 2, 0], size: [-x, z] },
        { face: 'south', from: [z * 2 + x, z], size: [x, y] },
        { face: 'north', from: [z, z], size: [x, y] }
    ];
    if (mirror) {
        for (let entry of list) {
            entry.from[0] += entry.size[0];
            entry.size[0] *= -1;
        }
        [list[0].from, list[0].size, list[1].from, list[1].size] = [list[1].from, list[1].size, list[0].from, list[0].size];
    }
    let faces = {};
    for (let entry of list) {
        faces[entry.face] = [
            entry.from[0] + offset[0],
            entry.from[1] + offset[1],
            entry.from[0] + entry.size[0] + offset[0],
            entry.from[1] + entry.size[1] + offset[1]
        ];
    }
    return faces;
}

function getBoxUvCorners(rectangle, textureSize) {
    let uv = rectangle.slice();
    for (let side = 0; side < 2; side++) {
        let margin = uv[side] > uv[side + 2] ? -1 / 64 : 1 / 64;
        uv[side] += margin;
        uv[side + 2] -= margin;
    }
    let [width, height] = textureSize;
    return [
        [uv[0] / width, 1 - uv[1] / height],
        [uv[2] / width, 1 - uv[1] / height],
        [uv[0] / width, 1 - uv[3] / height],
        [uv[2] / width, 1 - uv[3] / height]
    ];
}

function setBoxUv(geometry, cube, textureSize) {
    let faces = getBoxUvFaces(cube.size, cube.uv, !!cube.mirror);
    let attribute = geometry.attributes.uv;
    ARMOR_FACE_ORDER.forEach((face, faceIndex) => {
        getBoxUvCorners(faces[face], textureSize).forEach(([u, v], corner) => {
            attribute.setXY(faceIndex * 4 + corner, u, v);
        });
    });
    attribute.needsUpdate = true;
}

// =========================
// Building the wearer
// =========================
function createArmorNode(name) {
    let node = new THREE.Object3D();
    node.name = name;
    node.no_export = true;
    node.rotation.order = 'ZYX';
    return node;
}

function addArmorBoxMesh(overlay, parent, cube, pivot, material, uvSize) {
    let inflate = typeof cube.inflate === 'number' ? cube.inflate : 0;
    let size = cube.size;
    let geometry = new THREE.BoxGeometry(size[0] + inflate * 2, size[1] + inflate * 2, size[2] + inflate * 2);
    if (uvSize && Array.isArray(cube.uv)) setBoxUv(geometry, cube, uvSize);
    overlay.disposables.push(geometry);
    let mesh = new THREE.Mesh(geometry, material);
    mesh.name = 'display_sensei_wearer_cube';
    mesh.no_export = true;
    let centre = [-(cube.origin[0] + size[0] / 2), cube.origin[1] + size[1] / 2, cube.origin[2] + size[2] / 2];
    let origin = pivot;
    if (Array.isArray(cube.rotation) && Array.isArray(cube.pivot)) {
        let cubePivot = toBlockbenchPosition(cube.pivot);
        let turn = createArmorNode('display_sensei_wearer_turn');
        turn.position.set(cubePivot[0] - pivot[0], cubePivot[1] - pivot[1], cubePivot[2] - pivot[2]);
        setMeshRotation(turn, toBlockbenchRotation(cube.rotation));
        parent.add(turn);
        parent = turn;
        origin = cubePivot;
    }
    mesh.position.set(centre[0] - origin[0], centre[1] - origin[1], centre[2] - origin[2]);
    parent.add(mesh);
    return mesh;
}

function loadBundledWearerTexture(overlay, path) {
    let image = new Image();
    let texture = new THREE.Texture(image);
    texture.magFilter = THREE.NearestFilter;
    texture.minFilter = THREE.NearestFilter;
    image.onload = () => {
        texture.needsUpdate = true;
    };
    image.src = path;
    overlay.disposables.push(texture);
    return texture;
}

function getProjectTextureMap(overlay, uuid) {
    let texture = uuid && Project ? Texture.all.find(entry => entry.uuid === uuid) : null;
    if (!texture) return null;
    let material = typeof texture.getOwnMaterial === 'function' ? texture.getOwnMaterial() : null;
    let shared = material && material.uniforms && material.uniforms.map ? material.uniforms.map.value : null;
    if (shared) return shared;
    if (!texture.canvas) return null;
    let copy = new THREE.Texture(texture.canvas);
    copy.magFilter = THREE.NearestFilter;
    copy.minFilter = THREE.NearestFilter;
    copy.needsUpdate = true;
    overlay.disposables.push(copy);
    return copy;
}

function createArmorMaterial(overlay, settings) {
    let material = new THREE.MeshLambertMaterial(Object.assign({ side: THREE.DoubleSide }, settings));
    material.userData.normal = { transparent: material.transparent, opacity: material.opacity, depthWrite: material.depthWrite };
    overlay.disposables.push(material);
    return material;
}

function findWearerParentKey(wearer, key) {
    let parentKey = findRigBoneName(wearer, wearer.bones[key].parent);
    return parentKey && parentKey !== key ? parentKey : null;
}

function addWearerCube(overlay, joint, cube, pivot, materials, uvSize) {
    let isLayer = cube.layer === true;
    let mesh = addArmorBoxMesh(overlay, joint, cube, pivot, isLayer ? materials.layer : materials.skin, uvSize);
    (isLayer ? overlay.layerMeshes : overlay.wearerMeshes).push(mesh);
}

function buildWearerJoints(overlay, wearer) {
    let textured = !!wearer.texture;
    let map = textured ? loadBundledWearerTexture(overlay, wearer.texture) : null;
    let uvSize = textured ? BUNDLED_WEARER_TEXTURE_SIZE : null;
    let skin = createArmorMaterial(overlay, textured ? { map, alphaTest: 0.05 } : { color: 0xb4b9be });
    let layer = textured ? skin : createArmorMaterial(overlay, { color: 0xb4b9be, transparent: true, opacity: 0.3, depthWrite: false });
    let materials = { skin, layer };
    overlay.wearerMaterials.push(skin);
    if (layer !== skin) overlay.wearerMaterials.push(layer);
    let built = new Set();
    let build = (key, parentObject, parentPivot) => {
        if (built.has(key)) return;
        built.add(key);
        let bone = wearer.bones[key];
        let pivot = toBlockbenchPosition(bone.pivot || [0, 0, 0]);
        let joint = createArmorNode(`display_sensei_wearer_${key}`);
        joint.position.set(pivot[0] - parentPivot[0], pivot[1] - parentPivot[1], pivot[2] - parentPivot[2]);
        joint.userData.restPosition = joint.position.clone();
        joint.userData.restRotation = toBlockbenchRotation(bone.rotation || [0, 0, 0]);
        joint.userData.pivot = pivot;
        parentObject.add(joint);
        overlay.joints.set(key.toLowerCase(), joint);
        if (!bone.neverRender) {
            for (let cube of bone.cubes || []) addWearerCube(overlay, joint, cube, pivot, materials, uvSize);
        }
        for (let child of Object.keys(wearer.bones)) {
            if (findWearerParentKey(wearer, child) === key) build(child, joint, pivot);
        }
    };
    for (let key of Object.keys(wearer.bones)) {
        if (!findWearerParentKey(wearer, key)) build(key, overlay.poseRoot, [0, 0, 0]);
    }
    let overlayBones = wearer.overlay && wearer.overlay.bones ? wearer.overlay.bones : {};
    for (let key of Object.keys(overlayBones)) {
        let joint = overlay.joints.get(key.toLowerCase());
        let bone = overlayBones[key];
        if (!joint || bone.neverRender) continue;
        let pivot = toBlockbenchPosition(bone.pivot || [0, 0, 0]);
        for (let cube of bone.cubes || []) addWearerCube(overlay, joint, cube, pivot, { skin: layer, layer }, null);
    }
}

function buildFlatArmorPieces(overlay, wearer, slotId, mode, flatTexture) {
    if (mode === 'none') return;
    let flatArmor = isBabyWearer(wearer) ? FLAT_ARMOR_BABY : FLAT_ARMOR;
    let map = mode === 'flat' ? getProjectTextureMap(overlay, flatTexture) : null;
    let material = map
        ? createArmorMaterial(overlay, { map, alphaTest: 0.05 })
        : createArmorMaterial(overlay, { color: 0x8c99a6, transparent: true, opacity: 0.5, depthWrite: false });
    for (let slot of WEAR_SLOTS) {
        let piece = slot.flatPiece && isArmorSlotId(slot.id) && slot.id !== slotId ? flatArmor[slot.flatPiece] : null;
        if (!piece) continue;
        let uvSize = map ? [piece.textureWidth, piece.textureHeight] : null;
        let placed = new Set();
        let place = (key, parentObject, parentPivot) => {
            if (placed.has(key)) return;
            placed.add(key);
            let bone = piece.bones[key];
            let pivot = toBlockbenchPosition(bone.pivot || [0, 0, 0]);
            let holder = createArmorNode(`display_sensei_flat_${key}`);
            let joint = overlay.joints.get(key.toLowerCase());
            if (joint) {
                joint.add(holder);
            } else {
                parentObject.add(holder);
                holder.position.set(pivot[0] - parentPivot[0], pivot[1] - parentPivot[1], pivot[2] - parentPivot[2]);
            }
            for (let cube of bone.cubes || []) addArmorBoxMesh(overlay, holder, cube, pivot, material, uvSize);
            for (let child of Object.keys(piece.bones)) {
                if (findWearerParentKey(piece, child) === key) place(child, holder, pivot);
            }
        };
        for (let key of Object.keys(piece.bones)) {
            if (!findWearerParentKey(piece, key)) place(key, overlay.root, [0, 0, 0]);
        }
    }
}

function getArmorOverlayKey(wearer) {
    let options = armorOverlayOptions;
    return [wearer.id, getArmorPreviewSlotId(), options.otherSlots, options.otherSlots === 'flat' ? options.flatTexture : ''].join('|');
}

function buildArmorOverlay(wearer) {
    let overlay = {
        key: getArmorOverlayKey(wearer),
        root: createArmorNode('display_sensei_armor_overlay'),
        poseRoot: createArmorNode('display_sensei_armor_pose_root'),
        joints: new Map(),
        wearerMaterials: [],
        wearerMeshes: [],
        layerMeshes: [],
        disposables: []
    };
    overlay.root.add(overlay.poseRoot);
    buildWearerJoints(overlay, wearer);
    buildFlatArmorPieces(overlay, wearer, getArmorPreviewSlotId(), armorOverlayOptions.otherSlots, armorOverlayOptions.flatTexture);
    Canvas.scene.add(overlay.root);
    Canvas.gizmos.push(overlay.root);
    return overlay;
}

function disposeArmorOverlay() {
    if (!armorOverlay) return;
    let root = armorOverlay.root;
    if (root.parent) root.parent.remove(root);
    let index = Canvas.gizmos.indexOf(root);
    if (index >= 0) Canvas.gizmos.splice(index, 1);
    for (let item of armorOverlay.disposables) item.dispose();
    armorOverlay = null;
}

function applyArmorXray(overlay, on) {
    for (let material of overlay.wearerMaterials) {
        let normal = material.userData.normal;
        material.transparent = on || normal.transparent;
        material.opacity = on ? 0.35 : normal.opacity;
        material.depthWrite = !on && normal.depthWrite;
        material.depthTest = !on;
        material.needsUpdate = true;
    }
    for (let mesh of overlay.wearerMeshes.concat(overlay.layerMeshes)) mesh.renderOrder = on ? 2 : 0;
}

function applyArmorOverlayOptions(overlay) {
    let model = Project.model_3d;
    overlay.root.position.copy(model.position);
    overlay.root.quaternion.copy(model.quaternion);
    overlay.root.scale.copy(model.scale);
    overlay.root.visible = armorOverlayOptions.show;
    for (let mesh of overlay.layerMeshes) mesh.visible = armorOverlayOptions.outerLayer;
    applyArmorXray(overlay, armorOverlayOptions.xray);
}

// =========================
// Pose test
// =========================
function resolveArmorPose(wearerId, poseId) {
    if (!poseId) return null;
    return getWearerPoses(wearerId).find(pose => pose.id === poseId) || null;
}

function getPoseChoices(wearerId = armorWearerId) {
    return getWearerPoses(wearerId).map(pose => ({ id: pose.id, label: i18n(pose.label), chosen: !!pose.chosen }));
}

function startPoseTest(id) {
    if (!Modes.edit || !isArmorPreviewContext() || !resolveArmorPose(armorWearerId, id)) return false;
    activeArmorPose = id;
    refreshArmorPreviewSafely();
    return true;
}

function stopPoseTest() {
    if (!activeArmorPose) return false;
    activeArmorPose = null;
    refreshArmorPreviewSafely();
    return true;
}

function getActivePose() {
    return activeArmorPose;
}

function applyWearerPose(overlay, pose) {
    overlay.poseRoot.position.set(0, 0, 0);
    setMeshRotation(overlay.poseRoot, [0, 0, 0]);
    for (let joint of overlay.joints.values()) {
        joint.position.copy(joint.userData.restPosition);
        setMeshRotation(joint, joint.userData.restRotation);
    }
    if (pose) {
        for (let name of Object.keys(pose.bones || {})) {
            let joint = overlay.joints.get(name.toLowerCase());
            if (joint) setMeshRotation(joint, addVectors(joint.userData.restRotation, toBlockbenchRotation(pose.bones[name])));
        }
        for (let name of Object.keys(pose.positions || {})) {
            let joint = overlay.joints.get(name.toLowerCase());
            if (joint) joint.position.add(new THREE.Vector3().fromArray(toBlockbenchPosition(pose.positions[name])));
        }
        if (pose.root) {
            let pivot = new THREE.Vector3().fromArray(toBlockbenchPosition(pose.root.pivot || [0, 0, 0]));
            setMeshRotation(overlay.poseRoot, toBlockbenchRotation(pose.root.rotation || [0, 0, 0]));
            let turnedPivot = pivot.clone().applyEuler(overlay.poseRoot.rotation);
            overlay.poseRoot.position.fromArray(toBlockbenchPosition(pose.root.position || [0, 0, 0])).add(pivot).sub(turnedPivot);
        }
    }
    overlay.root.updateMatrixWorld(true);
}

// =========================
// Placing the model on the wearer
// =========================
function setFitPreview(on) {
    armorFitPreview = !!on;
    refreshArmorPreviewSafely();
    return true;
}

function restorePlacedMeshes() {
    for (let mesh of placedArmorMeshes) {
        if (mesh.fix_position) mesh.position.copy(mesh.fix_position);
        if (mesh.fix_rotation) mesh.rotation.copy(mesh.fix_rotation);
        mesh.scale.set(1, 1, 1);
        mesh.updateMatrixWorld(true);
    }
    placedArmorMeshes = [];
}

function placeArmorGroupMesh(group, overlay, fitOffsets, slotId) {
    let mesh = group.mesh;
    if (!mesh || !mesh.parent || !mesh.fix_position || !mesh.fix_rotation) return;
    let binding = parseBoneBinding(group.bedrock_binding);
    let joint = null;
    let offset = [0, 0, 0];
    if (binding.kind === 'none') {
        joint = overlay.joints.get(group.name.toLowerCase()) || null;
    } else {
        let target = getBindingTarget(binding, slotId);
        joint = target ? overlay.joints.get(target.toLowerCase()) || null : null;
        let anchor = group.parent instanceof Group ? group.parent.origin : BOUND_ROOT_ANCHOR;
        offset = subtractVectors(group.origin, anchor);
    }
    let fit = fitOffsets[group.name] ? toBlockbenchFitOffset(fitOffsets[group.name]) : null;
    if (!joint && !fit) return;
    let move = fit ? fit.position : [0, 0, 0];
    let turn = fit ? fit.rotation : [0, 0, 0];
    let rest = mesh.fix_rotation;
    let euler = new THREE.Euler(rest.x + turn[0] * DEGREES, rest.y + turn[1] * DEGREES, rest.z + turn[2] * DEGREES, rest.order);
    let quaternion = new THREE.Quaternion().setFromEuler(euler);
    let scale = new THREE.Vector3().fromArray(fit ? fit.scale : [1, 1, 1]);
    let local;
    if (joint) {
        let position = new THREE.Vector3(offset[0] + move[0], offset[1] + move[1], offset[2] + move[2]);
        let world = new THREE.Matrix4().compose(position, quaternion, scale).premultiply(joint.matrixWorld);
        local = new THREE.Matrix4().copy(mesh.parent.matrixWorld).invert().multiply(world);
    } else {
        let position = mesh.fix_position.clone().add(new THREE.Vector3().fromArray(move));
        local = new THREE.Matrix4().compose(position, quaternion, scale);
    }
    local.decompose(mesh.position, mesh.quaternion, mesh.scale);
    mesh.updateMatrixWorld(true);
    placedArmorMeshes.push(mesh);
}

function placeArmorModel(overlay) {
    let slotId = getArmorPreviewSlotId();
    let fitOffsets = armorFitPreview && slotId ? (getProjectData().armor.fit[slotId] || {}) : {};
    Project.model_3d.updateMatrixWorld(true);
    let visit = nodes => {
        for (let node of nodes) {
            if (!(node instanceof Group)) continue;
            placeArmorGroupMesh(node, overlay, fitOffsets, slotId);
            visit(node.children);
        }
    };
    visit(Outliner.root);
}

// =========================
// Held items on the holder
// =========================
const HELD_WEARER_IDS = ['player_wide', 'player_slim', 'zombie', 'baby_zombie', 'armor_stand'];
const HELD_CAMERAS = ['first', 'back', 'front'];
const HELD_ITEM_BONES = { main_hand: 'rightItem', off_hand: 'leftItem' };
const HELD_ARM_BONES = { main_hand: 'rightArm', off_hand: 'leftArm' };
const HOLDING_ARM = [-PLAYER_HOLD_ANGLE, 0, 0];

let heldPreview = null;
let heldWearerId = DEFAULT_WEARER_ID;

function getHeldWearerChoices() {
    return HELD_WEARER_IDS
        .map(findWearerRig)
        .filter(rig => rig && findRigBoneName(rig, 'rightItem') && findRigBoneName(rig, 'leftItem'))
        .map(rig => ({ id: rig.id, label: i18n(rig.label), textured: !!rig.texture }));
}

function setHeldWearer(id) {
    if (!getHeldWearerChoices().some(choice => choice.id === id)) return false;
    heldWearerId = id;
    refreshArmorPreviewSafely();
    return true;
}

function setHeldPreview(request) {
    let slot = request ? findHoldSlot(request.slotId) : null;
    let next = slot ? { slotId: slot.slotId, camera: HELD_CAMERAS.includes(request.camera) ? request.camera : 'back' } : null;
    let changed = JSON.stringify(next) !== JSON.stringify(heldPreview);
    heldPreview = next;
    if (changed) refreshArmorPreviewSafely();
    return isHeldPreviewShown();
}

function isHeldPreviewShown() {
    return !!heldPreview && isArmorPreviewContext();
}

function getHeldWearerRig() {
    return findWearerRig(heldWearerId) || findWearerRig(DEFAULT_WEARER_ID);
}

function getHeldArmTurns(wearer, slot) {
    let turns = {};
    let other = getOtherHoldHand(slot.hand);
    if (wearer.id === 'armor_stand') {
        let pose = STAND_POSES[STAND_DEFAULT_POSE];
        turns.rightArm = pose.rightarm.slice();
        turns.leftArm = pose.leftarm.slice();
    } else if (RAISED_ARM_WEARERS.includes(wearer.id)) {
        let arms = getZombieArms(wearer.id, slot.hand === 'off_hand' ? 'thirdperson_lefthand' : 'thirdperson_righthand');
        turns.rightArm = arms.right.slice();
        turns.leftArm = arms.left.slice();
    } else {
        turns[HELD_ARM_BONES[slot.hand]] = HOLDING_ARM.slice();
        turns[HELD_ARM_BONES[other]] = [0, 0, 0];
    }
    return { bones: toRigBoneNames(wearer, turns), positions: {}, root: null };
}

function buildHeldOverlay(wearer) {
    let overlay = {
        key: `held|${wearer.id}`,
        root: createArmorNode('display_sensei_held_overlay'),
        poseRoot: createArmorNode('display_sensei_held_pose_root'),
        joints: new Map(),
        wearerMaterials: [],
        wearerMeshes: [],
        layerMeshes: [],
        disposables: []
    };
    overlay.root.add(overlay.poseRoot);
    buildWearerJoints(overlay, wearer);
    Canvas.scene.add(overlay.root);
    Canvas.gizmos.push(overlay.root);
    return overlay;
}

function mirrorFrameX(matrix) {
    let mirror = new THREE.Matrix4().makeScale(-1, 1, 1);
    return mirror.clone().multiply(matrix).multiply(mirror);
}

function getFirstPersonHeldFrame(hand) {
    let frame = composeFirstPersonFrame();
    if (hand === 'off_hand') frame = mirrorFrameX(frame);
    return new THREE.Matrix4().copy(Project.model_3d.matrixWorld).multiply(frame);
}

function getBindingHand(binding, slot) {
    if (binding.kind === 'item_slot') return slot.hand;
    if (binding.kind === 'bone' && binding.hand) return /^left/i.test(binding.target) ? 'off_hand' : 'main_hand';
    return null;
}

function getHeldFrame(overlay, slot, hand) {
    if (slot.view === 'first_person') return getFirstPersonHeldFrame(hand);
    let joint = overlay ? overlay.joints.get(HELD_ITEM_BONES[hand].toLowerCase()) : null;
    return joint ? joint.matrixWorld.clone() : null;
}

function placeHeldGroupMesh(group, frame, values, anchor) {
    let mesh = group.mesh;
    if (!mesh || !mesh.parent || !mesh.fix_position || !mesh.fix_rotation) return;
    let move = toBlockbenchPosition(values.position);
    let turn = toBlockbenchRotation(values.rotation);
    let rest = mesh.fix_rotation;
    let euler = new THREE.Euler(rest.x + turn[0] * DEGREES, rest.y + turn[1] * DEGREES, rest.z + turn[2] * DEGREES, rest.order);
    let quaternion = new THREE.Quaternion().setFromEuler(euler);
    let scale = new THREE.Vector3().fromArray(values.scale.map(value => (Math.abs(value) < 0.0001 ? 0.0001 : value)));
    let local;
    if (frame) {
        let offset = subtractVectors(group.origin, anchor);
        let position = new THREE.Vector3(offset[0] + move[0], offset[1] + move[1], offset[2] + move[2]);
        let world = new THREE.Matrix4().compose(position, quaternion, scale).premultiply(frame);
        local = new THREE.Matrix4().copy(mesh.parent.matrixWorld).invert().multiply(world);
    } else {
        let position = mesh.fix_position.clone().add(new THREE.Vector3().fromArray(move));
        local = new THREE.Matrix4().compose(position, quaternion, scale);
    }
    local.decompose(mesh.position, mesh.quaternion, mesh.scale);
    mesh.updateMatrixWorld(true);
    placedArmorMeshes.push(mesh);
}

function placeHeldModel(overlay, slot) {
    let pose = getHoldPose(slot.slotId);
    if (!pose) return;
    Project.model_3d.updateMatrixWorld(true);
    if (overlay) overlay.root.updateMatrixWorld(true);
    for (let group of Outliner.root) {
        if (!(group instanceof Group)) continue;
        let hand = getBindingHand(parseBoneBinding(group.bedrock_binding), slot);
        let held = group.uuid === pose.bone.uuid;
        let frame = hand ? getHeldFrame(overlay, slot, hand) : null;
        if (frame) {
            placeHeldGroupMesh(group, frame, held ? pose.values : HOLD_IDENTITY, BOUND_ROOT_ANCHOR);
        } else if (held) {
            placeHeldGroupMesh(group, null, pose.values, null);
        }
    }
}

function refreshHeldPreview() {
    let slot = findHoldSlot(heldPreview.slotId);
    let firstPerson = slot.view === 'first_person';
    let wearer = getHeldWearerRig();
    if (!wearer) {
        disposeArmorOverlay();
    } else {
        if (!armorOverlay || armorOverlay.key !== `held|${wearer.id}`) {
            disposeArmorOverlay();
            armorOverlay = buildHeldOverlay(wearer);
        }
        let model = Project.model_3d;
        armorOverlay.root.position.copy(model.position);
        armorOverlay.root.quaternion.copy(model.quaternion);
        armorOverlay.root.scale.copy(model.scale);
        armorOverlay.root.visible = !firstPerson;
        applyArmorXray(armorOverlay, false);
        applyWearerPose(armorOverlay, getHeldArmTurns(wearer, slot));
    }
    syncHeldCrosshair(firstPerson && heldPreview.camera === 'first');
    if (armorCompileDepth === 0 && !isArmorModelEditOpen()) placeHeldModel(armorOverlay, slot);
}

function withHeldPreview(request, fn) {
    let saved = heldPreview;
    heldPreview = request;
    try {
        refreshArmorPreview();
        return fn();
    } finally {
        heldPreview = saved;
        refreshArmorPreview();
    }
}

function getHeldHandPosition(slot) {
    if (slot.view === 'first_person') return new THREE.Vector3().setFromMatrixPosition(getFirstPersonHeldFrame(slot.hand)).toArray();
    let frame = getHeldFrame(armorOverlay, slot, slot.hand);
    if (frame) return new THREE.Vector3().setFromMatrixPosition(frame).toArray();
    let side = slot.hand === 'off_hand' ? -1 : 1;
    return [TUNED_ITEM_POSITION[0] * side, TUNED_ITEM_POSITION[1], TUNED_ITEM_POSITION[2]];
}

const HELD_FIRST_PERSON_RATIO = 16 / 9;

function getHeldCameraPlacement(slot, camera) {
    if (camera === 'first') {
        let eye = FIRST_PERSON_RIG_EYE.slice();
        return { position: eye, target: [eye[0], eye[1], eye[2] + 10], fov: FIRST_PERSON_RIG_VFOV, aspectRatio: HELD_FIRST_PERSON_RATIO };
    }
    let handId = slot.hand === 'off_hand' ? 'left' : 'right';
    let placement = computeThirdPersonCamera(camera, handId, getHeldHandPosition(slot), null);
    return placement ? Object.assign(placement, { aspectRatio: undefined }) : null;
}

function applyHeldCamera() {
    let preview = getArmorCameraPreview();
    if (!heldPreview || !preview || !isHeldPreviewShown()) return false;
    let slot = findHoldSlot(heldPreview.slotId);
    let placement = getHeldCameraPlacement(slot, heldPreview.camera);
    if (!placement) return false;
    if (!savedArmorCamera || savedArmorCamera.preview !== preview) savedArmorCamera = saveArmorCamera(preview);
    preview.loadAnglePreset({
        projection: 'perspective',
        position: placement.position,
        target: placement.target,
        fov: placement.fov,
        aspect_ratio: placement.aspectRatio
    });
    if (typeof preview.resize === 'function') preview.resize();
    armorCameraView = `held_${heldPreview.camera}`;
    return true;
}

function getHeldPreviewState() {
    return {
        shown: isHeldPreviewShown(),
        slotId: heldPreview ? heldPreview.slotId : null,
        camera: heldPreview ? heldPreview.camera : null,
        cameraShown: typeof armorCameraView === 'string' && armorCameraView.startsWith('held_'),
        wearer: heldWearerId,
        wearers: getHeldWearerChoices(),
        context: isArmorPreviewContext(),
        crosshair: !!heldCrosshair && !!heldCrosshair.parentNode
    };
}

// =========================
// Held items: crosshair
// =========================
let heldCrosshair = null;

function syncHeldCrosshair(on) {
    let preview = getArmorCameraPreview();
    let wanted = on && !!preview && !!preview.node;
    if (!wanted) {
        if (heldCrosshair) heldCrosshair.remove();
        heldCrosshair = null;
        return;
    }
    if (!heldCrosshair) {
        heldCrosshair = document.createElement('div');
        heldCrosshair.className = 'display_crosshair ds-held-crosshair';
    }
    if (heldCrosshair.parentNode !== preview.node) preview.node.append(heldCrosshair);
}

// =========================
// Keeping the preview in step
// =========================
function refreshArmorPreview() {
    restorePlacedMeshes();
    if (!isArmorPreviewContext()) activeArmorPose = null;
    if (heldPreview && isArmorPreviewContext()) {
        refreshHeldPreview();
        return;
    }
    syncHeldCrosshair(false);
    if (armorOverlay && armorOverlay.key.startsWith('held|')) disposeArmorOverlay();
    let wearer = getArmorWearerRig();
    let needed = isArmorPreviewContext() && (armorOverlayOptions.show || !!activeArmorPose || armorFitPreview);
    if (!needed || !wearer) {
        disposeArmorOverlay();
        return;
    }
    if (!armorOverlay || armorOverlay.key !== getArmorOverlayKey(wearer)) {
        disposeArmorOverlay();
        armorOverlay = buildArmorOverlay(wearer);
    }
    applyArmorOverlayOptions(armorOverlay);
    applyWearerPose(armorOverlay, activeArmorPose ? resolveArmorPose(wearer.id, activeArmorPose) : null);
    if (armorCompileDepth === 0 && !isArmorModelEditOpen()) placeArmorModel(armorOverlay);
}

function refreshArmorPreviewSafely() {
    try {
        refreshArmorPreview();
    } catch (error) {
        console.warn(LOG_PREFIX, 'The armor preview failed:', error);
    }
}

let armorRefreshTimer = null;

function scheduleArmorPreviewRefresh() {
    if (armorRefreshTimer !== null) return;
    armorRefreshTimer = setTimeout(() => {
        armorRefreshTimer = null;
        refreshArmorPreviewSafely();
        refreshPanelSafely();
    }, 0);
}

const ARMOR_MESH_KEEPING_ASPECTS = ['textures', 'layers', 'bitmap', 'selected_texture', 'texture_order', 'uv_mode', 'uv_only', 'animations', 'keyframes', PROJECT_DATA_UNDO_ASPECT];

function isMeshKeepingEdit(aspects) {
    let uvOnly = aspects.uv_only === true;
    return Object.keys(aspects).every(name => !aspects[name] || ARMOR_MESH_KEEPING_ASPECTS.includes(name) || (uvOnly && name === 'elements'));
}

let armorModelEditOpen = false;

function isArmorModelEditOpen() {
    if (armorModelEditOpen && !(typeof Undo !== 'undefined' && Undo && Undo.current_save)) armorModelEditOpen = false;
    return armorModelEditOpen;
}

function onArmorInitEdit(event) {
    let aspects = event && event.aspects ? event.aspects : {};
    if (isMeshKeepingEdit(aspects)) return;
    armorModelEditOpen = true;
    activeArmorPose = null;
    restorePlacedMeshes();
    if (armorOverlay) applyWearerPose(armorOverlay, null);
}

function wrapCancelledEdits() {
    if (typeof UndoSystem === 'undefined' || !UndoSystem.prototype || typeof UndoSystem.prototype.cancelEdit !== 'function') return { delete() {} };
    return wrapMethod(UndoSystem.prototype, 'cancelEdit', function(original, args) {
        let open = !!this.current_save;
        let result = original.apply(this, args);
        if (open) scheduleArmorPreviewRefresh();
        return result;
    });
}

function onArmorPoseStopEvent() {
    let stopped = activeArmorPose !== null;
    activeArmorPose = null;
    refreshArmorPreview();
    if (stopped) refreshPanelSafely();
}

function onArmorModeUnselected() {
    restorePlacedMeshes();
}

function onArmorProjectUnselected() {
    activeArmorPose = null;
    restorePlacedMeshes();
    disposeArmorOverlay();
    syncHeldCrosshair(false);
    restoreHeldAspectRatio();
    savedArmorCamera = null;
    armorCameraView = null;
}

function restoreHeldAspectRatio() {
    let saved = savedArmorCamera;
    if (!saved || !Preview.all.includes(saved.preview) || saved.preview.aspect_ratio === saved.aspectRatio) return;
    saved.preview.aspect_ratio = saved.aspectRatio;
    if (typeof saved.preview.resize === 'function') saved.preview.resize();
}

const ARMOR_MESH_READING_CODECS = ['bedrock', 'bedrock_old', 'obj', 'gltf', 'fbx', 'collada', 'stl'];

function wrapCodecCompileAtRest(codec) {
    return wrapMethod(codec, 'compile', function(original, args) {
        if (!placedArmorMeshes.length) return original.apply(this, args);
        armorCompileDepth++;
        restorePlacedMeshes();
        let result;
        try {
            result = original.apply(this, args);
        } catch (error) {
            finishCompileAtRest();
            throw error;
        }
        if (result && typeof result.then === 'function') {
            result.then(finishCompileAtRest, finishCompileAtRest);
        } else {
            finishCompileAtRest();
        }
        return result;
    });
}

function finishCompileAtRest() {
    armorCompileDepth = Math.max(0, armorCompileDepth - 1);
    if (armorCompileDepth === 0) refreshArmorPreviewSafely();
}

function wrapScreenshotsAtRest() {
    return wrapMethod(Canvas, 'withoutGizmos', function(original, args) {
        if (!placedArmorMeshes.length) return original.apply(this, args);
        restorePlacedMeshes();
        try {
            return original.apply(this, args);
        } finally {
            refreshArmorPreviewSafely();
        }
    });
}

function wrapThumbnailAtRest() {
    if (typeof ModelProject === 'undefined' || !ModelProject.prototype || typeof ModelProject.prototype.updateThumbnail !== 'function') return { delete() {} };
    return wrapMethod(ModelProject.prototype, 'updateThumbnail', function(original, args) {
        let preview = typeof Preview !== 'undefined' ? Preview.selected : null;
        let wearerShown = !!armorOverlay && armorOverlay.root.visible;
        if (this !== Project || !preview || (!wearerShown && !placedArmorMeshes.length)) return original.apply(this, args);
        restorePlacedMeshes();
        if (armorOverlay) armorOverlay.root.visible = false;
        try {
            preview.render();
            return original.apply(this, args);
        } finally {
            refreshArmorPreviewSafely();
        }
    });
}

// =========================
// Cameras
// =========================
const ARMOR_CAMERA_PRESETS = { front: 'north', back: 'south', right: 'east', left: 'west' };
const ARMOR_CAMERA_MARGIN = 1.6;

function getArmorCameraPreview() {
    return Preview.selected || Preview.all.find(preview => preview.id === 'main') || null;
}

function isArmorCameraElement(element) {
    return !!element.mesh && !!element.mesh.geometry && element.visibility !== false && element.export !== false;
}

function findArmorSlotElements(slot, slotId, wearer) {
    let wearerNames = new Set(Object.keys(wearer.bones).map(key => key.toLowerCase()));
    let slotNames = new Set(slot.bones.map(name => name.toLowerCase()));
    let elements = [];
    let visit = (nodes, inSlot) => {
        for (let node of nodes) {
            if (node instanceof Group) {
                let binding = parseBoneBinding(node.bedrock_binding);
                let target = String((binding.kind === 'none' ? node.name : getBindingTarget(binding, slotId)) || '').toLowerCase();
                visit(node.children || [], wearerNames.has(target) ? slotNames.has(target) : inSlot);
            } else if (inSlot && isArmorCameraElement(node)) {
                elements.push(node);
            }
        }
    };
    visit(Outliner.root, false);
    return elements;
}

function getArmorModelBox(elements) {
    Project.model_3d.updateMatrixWorld(true);
    let box = new THREE.Box3();
    for (let element of elements) {
        if (!isArmorCameraElement(element)) continue;
        element.mesh.geometry.computeBoundingBox();
        box.union(element.mesh.geometry.boundingBox.clone().applyMatrix4(element.mesh.matrixWorld));
    }
    return box.isEmpty() ? null : { min: box.min.toArray(), max: box.max.toArray() };
}

function getArmorCameraBox(wearer) {
    let slotId = getArmorPreviewSlotId();
    let slot = findWearSlot(slotId);
    let keys = Object.keys(wearer.bones);
    let wanted = slot ? keys.filter(key => slot.bones.some(name => name.toLowerCase() === key.toLowerCase())) : [];
    let boxes = [];
    for (let key of wanted.length ? wanted : keys) {
        for (let cube of wearer.bones[key].cubes || []) {
            let min = [-(cube.origin[0] + cube.size[0]), cube.origin[1], cube.origin[2]];
            let max = [-cube.origin[0], cube.origin[1] + cube.size[1], cube.origin[2] + cube.size[2]];
            boxes.push({ min, max });
        }
    }
    if (Project && Project.model_3d) {
        let elements = slot ? findArmorSlotElements(slot, slotId, wearer) : [];
        let model = getArmorModelBox(elements.length ? elements : Outliner.elements);
        if (model) boxes.push(model);
    }
    return boxes.length ? mergeBoxes(boxes) : { min: [-8, 0, -8], max: [8, 32, 8] };
}

function getArmorCameraFrame(preview, view, box) {
    let centre = box.min.map((value, axis) => (value + box.max[axis]) / 2);
    let height = box.max[1] - box.min[1];
    let across = (view === 'front' || view === 'back') ? box.max[0] - box.min[0] : box.max[2] - box.min[2];
    let ratio = preview.width > 0 && preview.height > 0 ? preview.height / preview.width : 1;
    let needed = Math.max(height, across * ratio, 1) * ARMOR_CAMERA_MARGIN;
    let zoom = preview.height > 0 ? (preview.height / 40) / needed : 0.5;
    return { centre, zoom };
}

function saveArmorCamera(preview) {
    return {
        preview,
        orthographic: preview.isOrtho,
        position: preview.camera.position.toArray(),
        target: preview.controls.target.toArray(),
        sideTarget: preview.side_view_target.toArray(),
        zoom: preview.camOrtho.zoom,
        fov: preview.camPers.fov,
        angle: preview.angle,
        aspectRatio: preview.aspect_ratio
    };
}

function applyArmorCamera(view) {
    let presetId = ARMOR_CAMERA_PRESETS[view];
    let preset = presetId ? DefaultCameraPresets.find(entry => entry.id === presetId) : null;
    let preview = getArmorCameraPreview();
    let wearer = getArmorWearerRig();
    if (!preset || !preview || !wearer || !Project || getRoute() !== 'attachable') return false;
    if (!savedArmorCamera || savedArmorCamera.preview !== preview) savedArmorCamera = saveArmorCamera(preview);
    let frame = getArmorCameraFrame(preview, view, getArmorCameraBox(wearer));
    preview.side_view_target.fromArray(frame.centre);
    preview.loadAnglePreset({
        projection: 'orthographic',
        position: preset.position.slice(),
        target: frame.centre,
        zoom: preset.zoom,
        locked_angle: preset.locked_angle
    });
    preview.camOrtho.zoom = frame.zoom;
    preview.camOrtho.updateProjectionMatrix();
    preview.controls.update();
    armorCameraView = view;
    return true;
}

function restoreArmorCamera() {
    let saved = savedArmorCamera;
    savedArmorCamera = null;
    armorCameraView = null;
    if (!saved || !Preview.all.includes(saved.preview)) return false;
    let preview = saved.preview;
    if (preview.aspect_ratio !== saved.aspectRatio) {
        preview.aspect_ratio = saved.aspectRatio;
        if (typeof preview.resize === 'function') preview.resize();
    }
    preview.setProjectionMode(saved.orthographic);
    preview.camera.position.fromArray(saved.position);
    preview.controls.target.fromArray(saved.target);
    preview.side_view_target.fromArray(saved.sideTarget);
    if (saved.orthographic) {
        preview.camOrtho.zoom = saved.zoom;
        preview.camOrtho.updateProjectionMatrix();
    } else {
        preview.setFOV(saved.fov);
    }
    preview.setLockedAngle(saved.angle || undefined);
    preview.controls.update();
    return true;
}

// =========================
// State for the panel
// =========================
function getArmorPreviewState() {
    let wearer = getArmorWearerRig();
    let context = isArmorPreviewContext();
    return {
        slot: Project ? getArmorPreviewSlotId() : null,
        shown: context && !!armorOverlay && armorOverlay.root.visible,
        wearer: armorWearerId,
        textured: !!(wearer && wearer.texture),
        options: getOverlayOptions(),
        pose: activeArmorPose,
        canPose: context && !!Modes.edit,
        fitPreview: armorFitPreview,
        camera: armorCameraView,
        textures: Project ? Texture.all.map(texture => ({ uuid: texture.uuid, name: texture.name })) : [],
        missing: wearer && Array.isArray(wearer.missing) ? wearer.missing.slice() : []
    };
}

// =========================
// Install
// =========================
function installArmorPreview() {
    let codecHooks = ARMOR_MESH_READING_CODECS
        .filter(id => Codecs[id] && typeof Codecs[id].compile === 'function')
        .map(id => () => wrapCodecCompileAtRest(Codecs[id]));
    let hooks = createDeletables(codecHooks.concat([
        wrapScreenshotsAtRest,
        wrapThumbnailAtRest,
        wrapCancelledEdits,
        () => Blockbench.on('init_edit', guardListener('init_edit', onArmorInitEdit)),
        () => Blockbench.on('finished_edit', guardListener('finished_edit', refreshArmorPreview)),
        () => Blockbench.on('load_undo_save', guardListener('load_undo_save', scheduleArmorPreviewRefresh)),
        () => Blockbench.on('undo', guardListener('undo', onArmorPoseStopEvent)),
        () => Blockbench.on('redo', guardListener('redo', onArmorPoseStopEvent)),
        () => Blockbench.on('unselect_mode', guardListener('unselect_mode', onArmorModeUnselected)),
        () => Blockbench.on('select_mode', guardListener('select_mode', onArmorPoseStopEvent)),
        () => Blockbench.on('unselect_project', guardListener('unselect_project', onArmorProjectUnselected)),
        () => Blockbench.on('select_project', guardListener('select_project', refreshArmorPreview))
    ]));
    return {
        delete() {
            hooks.delete();
            if (armorRefreshTimer !== null) clearTimeout(armorRefreshTimer);
            armorRefreshTimer = null;
            armorModelEditOpen = false;
            restorePlacedMeshes();
            disposeArmorOverlay();
            syncHeldCrosshair(false);
            if (armorCameraView && armorCameraView.startsWith('held_')) restoreArmorCamera();
            heldPreview = null;
            heldWearerId = DEFAULT_WEARER_ID;
            armorWearerId = DEFAULT_WEARER_ID;
            armorOverlayOptions = Object.assign({}, ARMOR_OVERLAY_DEFAULTS);
            armorPreviewSlot = null;
            activeArmorPose = null;
            armorFitPreview = false;
            armorCompileDepth = 0;
            savedArmorCamera = null;
            armorCameraView = null;
        }
    };
}

registerModuleInstaller('armor_preview', installArmorPreview);

// ---- src/hold_views.js ----

// =========================
// Held 3D items: views and pictures (back end)
// =========================
const HOLD_VIEW_CAMERAS = Object.freeze({ first_person: 'first', third_back: 'back', third_front: 'front' });

function findHoldView(subtabId, handId) {
    let slot = findSlotForContext(subtabId, handId);
    let hold = slot ? findHoldSlot(slot.id) : null;
    let camera = HOLD_VIEW_CAMERAS[subtabId];
    return hold && camera ? { subtabId, handId: slot.hand, slotId: slot.id, camera } : null;
}

function showHoldView(subtabId, handId, aim = true) {
    let view = findHoldView(subtabId, handId);
    if (!view || !Project || getRoute() !== 'attachable') {
        hideHoldView();
        return null;
    }
    let before = getHeldPreviewState();
    let shown = setHeldPreview({ slotId: view.slotId, camera: view.camera });
    let moved = before.slotId !== view.slotId || before.camera !== view.camera;
    if (shown && (aim || moved || !before.cameraShown)) applyHeldCamera();
    return shown ? view.slotId : null;
}

function hideHoldView() {
    let state = getHeldPreviewState();
    if (!state.slotId) return false;
    setHeldPreview(null);
    if (state.cameraShown) restoreArmorCamera();
    return true;
}

function resetHoldView(subtabId, handId) {
    return showHoldView(subtabId, handId, true);
}

function getHoldViewChoices(subtabId, handId) {
    if (!isHeldPreviewShown() || !HAND_VIEW_SUBTABS.includes(subtabId)) return null;
    return HAND_VIEW_SUBTABS
        .filter(id => id !== subtabId)
        .map(id => findHoldView(id, handId))
        .filter(Boolean)
        .map(view => ({ subtabId: view.subtabId, handId: view.handId, slotId: view.slotId }));
}

// =========================
// Pictures of the other views
// =========================
let holdViewCamera = null;
let holdViewStats = { renders: 0, lastMs: 0, totalMs: 0, maxMs: 0 };

function frameHoldViewCamera(camera, placement, slot) {
    let box = new THREE.Box3().expandByPoint(new THREE.Vector3().fromArray(getHeldHandPosition(slot)));
    Project.model_3d.updateMatrixWorld(true);
    let itemBox = new THREE.Box3().setFromObject(Project.model_3d);
    if (!itemBox.isEmpty()) box.union(itemBox);
    let sphere = box.getBoundingSphere(new THREE.Sphere());
    let radius = Math.max(sphere.radius, HAND_VIEW_MIN_RADIUS) * HAND_VIEW_MARGIN;
    let direction = new THREE.Vector3().fromArray(placement.position).sub(new THREE.Vector3().fromArray(placement.target)).normalize();
    let distance = radius / Math.sin(placement.fov * Math.PI / 360);
    camera.position.copy(sphere.center).addScaledVector(direction, distance);
    camera.lookAt(sphere.center);
}

function aimHoldViewCamera(preview, slot, view, aspect) {
    if (!holdViewCamera) holdViewCamera = preview.camPers.clone(false);
    let camera = holdViewCamera;
    camera.copy(preview.camPers, false);
    camera.zoom = 1;
    camera.aspect = aspect;
    camera.up.set(0, 1, 0);
    let placement = getHeldCameraPlacement(slot, view);
    camera.fov = placement.fov;
    if (view === 'first') {
        camera.position.fromArray(placement.position);
        camera.lookAt(new THREE.Vector3().fromArray(placement.target));
    } else {
        frameHoldViewCamera(camera, placement, slot);
    }
    camera.updateProjectionMatrix();
    camera.updateMatrixWorld(true);
    return camera;
}

function drawHoldView(preview, camera, width, height) {
    let renderer = preview.renderer;
    let target = getHandViewTarget(renderer, width, height);
    let previousTarget = renderer.getRenderTarget();
    try {
        renderer.setRenderTarget(target);
        renderer.clear();
        renderer.render(Canvas.scene, camera);
    } finally {
        renderer.setRenderTarget(previousTarget);
    }
    return readHandViewPixels(renderer, target, width, height);
}

function renderHoldView(subtabId, handId, width, height) {
    let view = findHoldView(subtabId, handId);
    let preview = getArmorCameraPreview();
    let size = [Math.round(width), Math.round(height)];
    if (!view || !preview || !preview.renderer || !isHeldPreviewShown()) return null;
    if (!size.every(value => Number.isFinite(value) && value >= 1 && value <= MAX_HAND_VIEW_SIZE)) return null;
    if (Transformer.dragging || isArmorModelEditOpen()) return null;
    let started = performance.now();
    let image;
    try {
        image = withHeldPreview({ slotId: view.slotId, camera: view.camera }, () => {
            let slot = findHoldSlot(view.slotId);
            let gizmo = Transformer.visible;
            Transformer.visible = false;
            try {
                return drawHoldView(preview, aimHoldViewCamera(preview, slot, view.camera, size[0] / size[1]), size[0], size[1]);
            } finally {
                Transformer.visible = gizmo;
            }
        });
    } catch (error) {
        console.warn(LOG_PREFIX, 'Could not draw the held item view:', error);
        return null;
    }
    let took = performance.now() - started;
    holdViewStats.renders++;
    holdViewStats.lastMs = took;
    holdViewStats.totalMs += took;
    holdViewStats.maxMs = Math.max(holdViewStats.maxMs, took);
    return image;
}

function getHoldViewStats() {
    let stats = holdViewStats;
    return { renders: stats.renders, lastMs: stats.lastMs, averageMs: stats.renders ? stats.totalMs / stats.renders : 0, maxMs: stats.maxMs };
}

// =========================
// Install
// =========================
function installHoldViews() {
    holdViewStats = { renders: 0, lastMs: 0, totalMs: 0, maxMs: 0 };
    return {
        delete() {
            holdViewCamera = null;
        }
    };
}

registerModuleInstaller('hold_views', installHoldViews);

// ---- src/pivot_markers.js ----

// =========================
// Pivot markers (block route)
// =========================
const PIVOT_MARKER_COLORS = Object.freeze({
    rotation_pivot: '#e040fb',
    scale_pivot: '#ffab00'
});

const PIVOT_MARKER_OUTLINE = { color: '#101010', opacity: 0.9 };

const PIVOT_MARKER_ORDER = ['scale_pivot', 'rotation_pivot'];

const PIVOT_MARKER_SHAPES = {
    rotation_pivot: [
        { kind: 'ring', inner: 10.5, outer: 17, segments: 48, outline: true },
        { kind: 'ring', inner: 12, outer: 15.5, segments: 48 },
        { kind: 'disc', radius: 3.5, outline: true },
        { kind: 'disc', radius: 2.2 }
    ],
    scale_pivot: [
        { kind: 'ring', inner: 3.1, outer: 11.3, segments: 4, outline: true },
        { kind: 'ring', inner: 5.2, outer: 9.2, segments: 4 },
        { kind: 'disc', radius: 2.8, outline: true },
        { kind: 'disc', radius: 1.6 }
    ]
};

const PIVOT_MARKER_DISC_SEGMENTS = 24;
const PIVOT_MARKER_RENDER_ORDER = 990;
const PIVOT_MARKER_SYNC_EVENTS = 'select_mode unselect_mode select_project unselect_project select_format convert_format';
const PIVOT_BLOCK_PIXELS = 16;

let pivotMarkers = null;
let pivotMarkerRequest = { on: false, slotId: null };
let isPivotMarkerModuleInstalled = false;

// =========================
// Where the pivots are
// =========================
function toPivotPixels(pivot, side) {
    let values = Array.isArray(pivot) ? pivot : [0, 0, 0];
    return new THREE.Vector3(values[0] * side, values[1], values[2]).multiplyScalar(PIVOT_BLOCK_PIXELS);
}

function computePivotMarkerPoints(slot) {
    let values = getDrawnDisplaySlot(slot);
    let base = DisplayMode.display_base;
    if (!values || !base || !Array.isArray(values.scale)) return null;
    let side = LEFT_HAND_PIVOT_MIRROR && isLeftHandSlot(DisplayMode.display_slot) ? -1 : 1;
    let rotationPivot = toPivotPixels(values.rotation_pivot, side).applyEuler(base.rotation);
    let scalePivot = toPivotPixels(values.scale_pivot, side);
    let shrink = new THREE.Vector3(1 - values.scale[0], 1 - values.scale[1], 1 - values.scale[2]);
    let turnedScalePivot = scalePivot.clone().applyEuler(base.rotation).multiply(shrink);
    return {
        rotation_pivot: base.position.clone().add(rotationPivot).sub(turnedScalePivot),
        scale_pivot: base.position.clone().add(scalePivot.multiply(base.scale).applyEuler(base.rotation))
    };
}

// =========================
// Building the markers
// =========================
function createPivotMarkerNode(name) {
    let node = new THREE.Object3D();
    node.name = name;
    node.no_export = true;
    return node;
}

function createPivotMarkerMaterial(color, opacity) {
    let material = new THREE.MeshBasicMaterial({
        color: new THREE.Color(color),
        transparent: true,
        opacity,
        depthTest: false,
        depthWrite: false,
        side: THREE.DoubleSide,
        fog: false
    });
    material.toneMapped = false;
    return material;
}

function createPivotMarkerGeometry(shape) {
    if (shape.kind === 'ring') return new THREE.RingGeometry(shape.inner, shape.outer, shape.segments);
    return new THREE.CircleGeometry(shape.radius, PIVOT_MARKER_DISC_SEGMENTS);
}

function buildPivotMarkers() {
    let built = {
        root: createPivotMarkerNode('display_sensei_pivot_markers'),
        markers: {},
        disposables: [],
        slotId: null,
        scratch: {
            position: new THREE.Vector3(),
            view: new THREE.Vector3(),
            quaternion: new THREE.Quaternion(),
            scale: new THREE.Vector3(),
            viewport: new THREE.Vector4()
        }
    };
    let outline = createPivotMarkerMaterial(PIVOT_MARKER_OUTLINE.color, PIVOT_MARKER_OUTLINE.opacity);
    built.disposables.push(outline);
    let faceCamera = function(renderer, scene, camera) {
        facePivotMarkerToCamera(this, renderer, camera, built.scratch);
    };
    PIVOT_MARKER_ORDER.forEach((id, index) => {
        let marker = createPivotMarkerNode(`display_sensei_pivot_marker_${id}`);
        let fill = createPivotMarkerMaterial(PIVOT_MARKER_COLORS[id], 1);
        built.disposables.push(fill);
        for (let shape of PIVOT_MARKER_SHAPES[id]) {
            let geometry = createPivotMarkerGeometry(shape);
            built.disposables.push(geometry);
            let mesh = new THREE.Mesh(geometry, shape.outline ? outline : fill);
            mesh.name = `display_sensei_pivot_marker_${id}_${shape.outline ? 'outline' : 'fill'}`;
            mesh.no_export = true;
            mesh.frustumCulled = false;
            mesh.renderOrder = PIVOT_MARKER_RENDER_ORDER + (shape.outline ? 0 : index + 1);
            mesh.onBeforeRender = faceCamera;
            marker.add(mesh);
        }
        built.root.add(marker);
        built.markers[id] = marker;
    });
    return built;
}

function getScreenPixelSize(renderer, camera, position, scratch) {
    let view = scratch.view.copy(position).applyMatrix4(camera.matrixWorldInverse);
    let projection = camera.projectionMatrix.elements;
    let depth = Math.max(projection[11] * view.z + projection[15], 1e-6);
    let viewport = renderer.getCurrentViewport(scratch.viewport);
    let ratio = renderer.getRenderTarget() ? 1 : renderer.getPixelRatio();
    return 2 * ratio * depth / (projection[5] * Math.max(viewport.w, 1));
}

function facePivotMarkerToCamera(mesh, renderer, camera, scratch) {
    let position = scratch.position.setFromMatrixPosition(mesh.matrixWorld);
    let size = getScreenPixelSize(renderer, camera, position, scratch);
    scratch.quaternion.setFromRotationMatrix(camera.matrixWorld);
    mesh.matrixWorld.compose(position, scratch.quaternion, scratch.scale.setScalar(size));
}

// =========================
// Showing and hiding
// =========================
function attachPivotMarkers(built) {
    let area = DisplayMode.display_area;
    let root = built.root;
    if (root.parent !== area) area.add(root);
    if (!Canvas.gizmos.includes(root)) Canvas.gizmos.push(root);
    if (!Object.prototype.hasOwnProperty.call(root, 'was_visible')) root.visible = true;
}

function detachPivotMarkers() {
    if (!pivotMarkers) return;
    let root = pivotMarkers.root;
    if (root.parent) root.parent.remove(root);
    let index = Canvas.gizmos.indexOf(root);
    if (index >= 0) Canvas.gizmos.splice(index, 1);
    pivotMarkers.slotId = null;
}

function disposePivotMarkers() {
    if (!pivotMarkers) return;
    detachPivotMarkers();
    for (let item of pivotMarkers.disposables) item.dispose();
    pivotMarkers = null;
}

function getPivotMarkerSlotId() {
    if (!isPivotMarkerModuleInstalled || !pivotMarkerRequest.on || !Modes.display || !isOwnPanelShown()) return null;
    let slotId = pivotMarkerRequest.slotId || DisplayMode.display_slot;
    return isShowingSlot(slotId) ? slotId : null;
}

function syncPivotMarkers(slot) {
    let slotId = getPivotMarkerSlotId();
    let points = slotId ? computePivotMarkerPoints(slot) : null;
    if (!points) {
        detachPivotMarkers();
        return;
    }
    if (!pivotMarkers) pivotMarkers = buildPivotMarkers();
    for (let id of PIVOT_MARKER_ORDER) pivotMarkers.markers[id].position.copy(points[id]);
    attachPivotMarkers(pivotMarkers);
    pivotMarkers.slotId = slotId;
}

function setPivotMarkersShown(on, slotId = null) {
    pivotMarkerRequest = { on: !!on, slotId: on && slotId ? slotId : null };
    syncPivotMarkers();
    return getPivotMarkerState().shown;
}

function isPivotMarkerShown() {
    let root = pivotMarkers && pivotMarkers.root;
    return !!root && root.parent === DisplayMode.display_area && !!DisplayMode.display_area.parent &&
        Canvas.gizmos.includes(root) && !!Modes.display && getRoute() === 'block';
}

function getPivotMarkerState() {
    let shown = isPivotMarkerShown();
    let point = id => pivotMarkers.markers[id].getWorldPosition(new THREE.Vector3()).toArray();
    return {
        shown,
        requested: pivotMarkerRequest.on,
        slotId: shown ? pivotMarkers.slotId : null,
        rotationPivot: shown ? point('rotation_pivot') : null,
        scalePivot: shown ? point('scale_pivot') : null,
        colors: Object.assign({}, PIVOT_MARKER_COLORS)
    };
}

// =========================
// Following the preview
// =========================
function updateDisplayBaseWithPivotMarkers(original, args) {
    let result = original.apply(this, args);
    if (isDrawingHandView()) return result;
    try {
        syncPivotMarkers(args[0]);
    } catch (error) {
        console.warn(LOG_PREFIX, 'The pivot markers could not follow the preview:', error);
        detachPivotMarkers();
    }
    return result;
}

function wrapThumbnailWithoutPivotMarkers() {
    if (typeof ModelProject === 'undefined' || !ModelProject.prototype || typeof ModelProject.prototype.updateThumbnail !== 'function') return { delete() {} };
    return wrapMethod(ModelProject.prototype, 'updateThumbnail', function(original, args) {
        let preview = typeof Preview !== 'undefined' ? Preview.selected : null;
        let root = pivotMarkers && pivotMarkers.root;
        if (this !== Project || !preview || !root || !root.parent || !root.visible) return original.apply(this, args);
        root.visible = false;
        try {
            preview.render();
            return original.apply(this, args);
        } finally {
            root.visible = true;
        }
    });
}

// =========================
// Install
// =========================
function installPivotMarkers() {
    pivotMarkerRequest = { on: false, slotId: null };
    let hooks = createDeletables([
        () => wrapMethod(DisplayMode, 'updateDisplayBase', updateDisplayBaseWithPivotMarkers),
        wrapThumbnailWithoutPivotMarkers,
        () => Blockbench.on(PIVOT_MARKER_SYNC_EVENTS, guardListener('pivot markers', () => syncPivotMarkers()))
    ]);
    isPivotMarkerModuleInstalled = true;
    return {
        delete() {
            isPivotMarkerModuleInstalled = false;
            hooks.delete();
            disposePivotMarkers();
            pivotMarkerRequest = { on: false, slotId: null };
        }
    };
}

registerModuleInstaller('pivot_markers', installPivotMarkers);

// ---- src/panel_css.js ----

// =========================
// Panel stylesheet
// =========================
const CSS_STYLE_ID = 'display_sensei_plugin_css';

const DS_PANEL_CSS = `
.display-sensei-body {
    --ds-accent: #2ba8ff;
    --ds-accent-strong: #007acc;
    --ds-primary-top: #4f95f7;
    --ds-primary-bottom: #3e7ad6;
    --ds-primary-hover-top: #5fa3ff;
    --ds-primary-hover-bottom: #4a88e8;
    --ds-primary-edge: rgba(255, 255, 255, 0.14);
    --ds-tab-active-top: #244763;
    --ds-tab-active-bottom: #1b3447;
    --ds-on-accent: #fff;
    --ds-outline: color-mix(in srgb, var(--color-text) 25%, var(--color-button));
    --ds-glow: 0 0 0 1px color-mix(in srgb, var(--ds-accent) 55%, transparent),
        0 0 10px color-mix(in srgb, var(--ds-accent-strong) 45%, transparent);
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    min-height: 0;
    overflow: hidden;
}
.display-sensei-body *,
.display-sensei-body *::before,
.display-sensei-body *::after {
    box-sizing: border-box;
}
.display-sensei-body p {
    margin: 0;
}

.display-sensei-body .ds-scroll {
    flex: 1 1 auto;
    min-height: 0;
    overflow-y: auto;
    overflow-x: hidden;
    scrollbar-gutter: stable both-edges;
    display: flex;
    flex-direction: column;
    padding: 10px 2px 4px 2px;
}
.display-sensei-body .ds-footer {
    flex: 0 0 auto;
    overflow: hidden;
    scrollbar-gutter: stable both-edges;
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding: 8px 2px 10px 2px;
    border-top: 1px solid var(--color-border);
}

.display-sensei-body .ds-header {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: flex-start;
    gap: 8px;
    margin-bottom: 10px;
}
.display-sensei-body .ds-header-text {
    flex: 1 1 auto;
    min-width: 0;
}
.display-sensei-body .ds-title {
    margin: 2px 0 0 0;
    white-space: nowrap;
}
.display-sensei-body .ds-subtitle {
    margin-top: 2px;
    font-size: 12px;
    color: var(--color-subtle_text);
}

.display-sensei-body .ds-tip {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex: 0 0 auto;
    width: 13px;
    height: 13px;
    margin-left: 4px;
    vertical-align: -2px;
    border: 1px solid var(--ds-outline);
    border-radius: 50%;
    color: var(--color-subtle_text);
    font-size: 9px;
    font-weight: 700;
    font-style: normal;
    line-height: 1;
    cursor: help;
    user-select: none;
}
.display-sensei-body .ds-tip::before {
    content: 'i';
}
.display-sensei-body .ds-tip:hover {
    border-color: var(--ds-accent);
    color: var(--color-text);
}
.display-sensei-body .ds-flex-row > .ds-tip,
.display-sensei-body .ds-view-caption-row > .ds-tip,
.display-sensei-body .ds-preset-note > .ds-tip {
    margin-left: 0;
}
.display-sensei-body .ds-preset-note {
    flex: 0 1 auto;
    display: inline-flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: flex-end;
    gap: 4px;
    min-width: 0;
}

.display-sensei-body select,
.display-sensei-body textarea,
.display-sensei-body input[type="number"] {
    width: 100%;
    height: 28px;
    padding: 4px 6px;
    font-size: 11px;
    line-height: 18px;
    border: 1px solid var(--color-border);
    border-radius: 3px;
    background: var(--color-back);
    color: var(--color-text);
    margin: 0;
}
.display-sensei-body textarea {
    height: auto;
    min-height: 28px;
    resize: vertical;
}
.display-sensei-body select {
    padding-right: 20px;
    background-image:
        linear-gradient(45deg, transparent 50%, var(--color-subtle_text) 50%),
        linear-gradient(135deg, var(--color-subtle_text) 50%, transparent 50%);
    background-position: calc(100% - 12px) 50%, calc(100% - 8px) 50%;
    background-size: 4px 4px, 4px 4px;
    background-repeat: no-repeat;
    text-overflow: ellipsis;
}
.display-sensei-body button {
    height: 28px;
    min-width: 0;
    padding: 4px 8px;
    font-size: 11px;
    line-height: 18px;
    border: 1px solid var(--color-border);
    border-radius: 3px;
    background: var(--color-back);
    color: var(--color-text);
    cursor: pointer;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
.display-sensei-body button:hover:not(:disabled) {
    border-color: var(--ds-accent);
}
.display-sensei-body button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}
.display-sensei-body .ds-primary {
    border-color: var(--ds-primary-edge);
    background: linear-gradient(180deg, var(--ds-primary-top), var(--ds-primary-bottom));
    color: var(--ds-on-accent);
    font-weight: 600;
}
.display-sensei-body .ds-primary:hover:not(:disabled) {
    background: linear-gradient(180deg, var(--ds-primary-hover-top), var(--ds-primary-hover-bottom));
}
.display-sensei-body .ds-primary:disabled {
    border-color: var(--color-border);
    background: var(--color-back);
    color: var(--color-text);
    font-weight: normal;
}

.display-sensei-body .ds-tabs {
    display: flex;
    gap: 4px;
    margin-bottom: 10px;
}
.display-sensei-body .ds-tab {
    flex: 1 1 auto;
    min-width: 0;
    padding: 4px;
    font-size: 10px;
    border: 1px solid var(--ds-outline);
    background: var(--color-button);
    color: var(--color-text);
    transition: background 120ms ease, box-shadow 120ms ease, border-color 120ms ease;
}
.display-sensei-body .ds-tab.active {
    border-color: var(--ds-accent);
    background: linear-gradient(180deg, var(--ds-tab-active-top) 0%, var(--ds-tab-active-bottom) 100%);
    box-shadow: var(--ds-glow);
    color: var(--ds-on-accent);
}

.display-sensei-body .ds-subtab-row {
    display: flex;
    gap: 4px;
    margin-bottom: 8px;
}
.display-sensei-body .ds-subtabs {
    flex: 1 1 0;
    min-width: 0;
}
.display-sensei-body .ds-subtab {
    padding: 4px;
}
.display-sensei-body .ds-subtab.active {
    border-color: var(--ds-accent);
    box-shadow: var(--ds-glow);
}
.display-sensei-body .ds-subtabs.ds-grid-5 {
    display: flex;
}
.display-sensei-body .ds-subtabs.ds-grid-5 .ds-subtab {
    flex: 1 1 auto;
    min-width: 0;
    padding: 4px 2px;
}
.display-sensei-body .ds-subtab.ds-worn {
    position: relative;
}
.display-sensei-body .ds-subtab.ds-worn::after {
    content: '';
    position: absolute;
    top: 3px;
    right: 3px;
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: var(--ds-accent);
    pointer-events: none;
}
.display-sensei-body .ds-hand-toggle {
    flex: 0 0 auto;
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    padding-left: 4px;
    border-left: 1px solid var(--ds-outline);
}
.display-sensei-body .ds-segment-group {
    flex: 1 1 auto;
    min-width: 0;
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
}
.display-sensei-body .ds-segment {
    padding: 4px;
    border-radius: 0;
}
.display-sensei-body .ds-segment:first-child {
    border-radius: 3px 0 0 3px;
}
.display-sensei-body .ds-segment:last-child {
    margin-left: -1px;
    border-radius: 0 3px 3px 0;
}
.display-sensei-body .ds-segment.active {
    position: relative;
    border-color: var(--ds-accent);
    background: color-mix(in srgb, var(--ds-accent) 28%, var(--color-back));
}
.display-sensei-body .ds-segment:hover:not(:disabled) {
    position: relative;
    z-index: 1;
}

.display-sensei-body .ds-view {
    display: flex;
    flex-direction: column;
    gap: 4px;
    margin: 8px 0;
    padding: 6px;
    border-radius: 3px;
    background: color-mix(in srgb, var(--color-text) 4%, transparent);
}
.display-sensei-body .ds-view-head {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 4px;
}
.display-sensei-body .ds-view-head .ds-icon-button {
    margin-left: auto;
}
.display-sensei-body .ds-view-toggle {
    flex: 0 0 auto;
    display: inline-flex;
    align-items: center;
    gap: 2px;
    padding: 4px 6px 4px 2px;
    border-color: transparent;
    background: transparent;
    color: var(--color-subtle_text);
}
.display-sensei-body .ds-view-toggle .material-icons {
    font-size: 16px;
    transform: rotate(-90deg);
    transition: transform 120ms ease;
}
.display-sensei-body .ds-view-toggle.open .material-icons {
    transform: none;
}
.display-sensei-body .ds-flex-row.ds-view-reference {
    align-items: flex-start;
}
.display-sensei-body .ds-view-reference > .ds-row-label {
    line-height: 28px;
}
.display-sensei-body .ds-view-picker {
    flex: 1 1 auto;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 2px;
}
.display-sensei-body .ds-view-caption {
    font-size: 10px;
    line-height: 1.4;
    color: var(--color-subtle_text);
    overflow-wrap: anywhere;
}
.display-sensei-body .ds-view-caption-row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 4px;
    min-height: 18px;
}
.display-sensei-body .ds-view-note {
    font-size: 10px;
    line-height: 1.4;
    color: var(--color-text);
    overflow-wrap: anywhere;
}
.display-sensei-body .ds-view .ds-row-label {
    min-width: 60px;
}
.display-sensei-body .ds-view-actions {
    display: flex;
    justify-content: flex-end;
}
.display-sensei-body .ds-view input[type="range"] {
    flex: 1 1 auto;
    margin: 0;
}
.display-sensei-body .ds-view-value {
    flex: 0 0 40px;
    font-size: 11px;
    text-align: right;
    color: var(--color-text);
}
.display-sensei-body .ds-view .ds-check-row {
    min-height: 20px;
    padding: 0;
}
.display-sensei-body .ds-hand-views {
    display: flex;
    flex-direction: column;
    gap: 4px;
    margin: 0 0 8px 0;
    padding: 6px;
    border-radius: 3px;
    background: color-mix(in srgb, var(--color-text) 4%, transparent);
}
.display-sensei-body .ds-hand-views-head {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 4px;
}
.display-sensei-body .ds-hand-view-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 4px;
}
.display-sensei-body .ds-hand-view {
    min-width: 0;
    height: auto;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: 2px;
    padding: 2px;
}
.display-sensei-body .ds-hand-view:hover {
    border-color: var(--ds-accent);
}
.display-sensei-body .ds-hand-view-picture {
    position: relative;
    display: block;
    border-radius: 2px;
    overflow: hidden;
    background: var(--color-back);
}
.display-sensei-body .ds-hand-view-picture canvas {
    display: block;
    width: 100%;
    height: auto;
    aspect-ratio: 16 / 9;
}
.display-sensei-body .ds-hand-view-picture canvas.ds-stale {
    opacity: 0.35;
}
.display-sensei-body .ds-hand-view-picture.ds-crosshair::before,
.display-sensei-body .ds-hand-view-picture.ds-crosshair::after {
    content: '';
    position: absolute;
    left: 50%;
    top: 50%;
    background: var(--color-light);
    opacity: 0.8;
    pointer-events: none;
}
.display-sensei-body .ds-hand-view-picture.ds-crosshair::before {
    width: 9px;
    height: 1px;
    transform: translate(-50%, -50%);
}
.display-sensei-body .ds-hand-view-picture.ds-crosshair::after {
    width: 1px;
    height: 9px;
    transform: translate(-50%, -50%);
}
.display-sensei-body .ds-hand-view-label {
    font-size: 10px;
    line-height: 1.4;
    text-align: center;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: var(--color-text);
}
.display-sensei-body .ds-calibration-actions {
    display: flex;
    flex-direction: column;
    gap: 4px;
    margin: 4px 0;
}
.display-sensei-body .ds-calibration-actions button {
    min-width: 0;
    white-space: normal;
    height: auto;
    min-height: 28px;
}
.display-sensei-body .ds-icon-button {
    flex: 0 0 auto;
    display: inline-flex;
    align-items: center;
    gap: 4px;
}
.display-sensei-body .ds-icon-button .material-icons {
    font-size: 14px;
}
.display-sensei-body .ds-icon-segments {
    min-width: 0;
    display: flex;
}
.display-sensei-body .ds-icon-segments .ds-segment {
    flex: 1 1 0;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 4px 0;
}
.display-sensei-body .ds-icon-segments .ds-segment + .ds-segment {
    margin-left: -1px;
}
.display-sensei-body .ds-icon-segments .icon {
    font-size: 16px;
    line-height: 18px;
}

.display-sensei-body .ds-route-badge {
    display: flex;
    align-items: center;
    align-self: flex-start;
    gap: 6px;
    max-width: 100%;
    margin-bottom: 10px;
    padding: 3px 10px;
    border: 1px solid var(--ds-outline);
    border-radius: 999px;
    background: color-mix(in srgb, var(--ds-accent) 12%, transparent);
    color: var(--color-text);
    font-size: 11px;
}
.display-sensei-body .ds-route-format {
    font-family: var(--font-code);
    font-size: 10px;
    color: var(--color-subtle_text);
}

.display-sensei-body .ds-section {
    margin-bottom: 12px;
    padding: 8px;
    background: var(--color-back);
    border-radius: 4px;
}
.display-sensei-body .ds-section-label {
    font-size: 11px;
    color: var(--color-subtle_text);
    margin-bottom: 4px;
}
.display-sensei-body .ds-section-head {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 2px 4px;
    margin-bottom: 4px;
}
.display-sensei-body .ds-section-head .ds-section-label {
    flex: 1 1 auto;
    min-width: 0;
    margin-bottom: 0;
}
.display-sensei-body .ds-pivot-key {
    display: inline-block;
    width: 8px;
    height: 8px;
    margin: 0 6px 0 2px;
    vertical-align: 0;
    border-radius: 50%;
    background: var(--ds-pivot-key-color);
    box-shadow: 0 0 0 1px rgba(16, 16, 16, 0.9);
}
.display-sensei-body .ds-pivot-key[data-ds-pivot-key="scale_pivot"] {
    border-radius: 1px;
    transform: rotate(45deg) scale(0.85);
}
.display-sensei-body .ds-reset-button {
    flex: 0 0 auto;
    display: inline-flex;
    align-items: center;
    gap: 2px;
    height: 20px;
    margin-left: auto;
    padding: 0 6px;
    font-size: 10px;
    line-height: 18px;
}
.display-sensei-body .ds-reset-button .material-icons {
    font-size: 12px;
}
.display-sensei-body .ds-transform-box {
    margin-bottom: 15px;
    padding: 10px;
    background: var(--color-back);
    border-radius: 4px;
    border-left: 4px solid var(--ds-accent-strong);
}
.display-sensei-body .ds-transform-box h5 {
    font-size: 13px;
    margin: 0 0 8px 0;
    color: var(--ds-accent-strong);
}
.display-sensei-body .ds-info-card {
    margin-bottom: 15px;
    padding: 10px;
    background: var(--color-back);
    border-radius: 4px;
    border-left: 4px solid var(--color-button);
    color: var(--color-subtle_text);
    font-size: 11px;
    line-height: 1.4;
}
.display-sensei-body .ds-info-card h5 {
    font-size: 13px;
    margin: 0 0 6px 0;
    color: var(--color-text);
}
.display-sensei-body .ds-transform-box p + p,
.display-sensei-body .ds-info-card p + p {
    margin-top: 6px;
}
.display-sensei-body .ds-card-key {
    margin-bottom: 8px;
    font-size: 11px;
    line-height: 1.4;
    color: var(--color-text);
    overflow-wrap: anywhere;
}
.display-sensei-body .ds-card-text {
    font-size: 11px;
    line-height: 1.4;
    color: var(--color-text);
}
.display-sensei-body .ds-card-note {
    padding: 6px 8px;
    border: 1px solid color-mix(in srgb, var(--ds-accent) 35%, transparent);
    border-radius: 3px;
    background: color-mix(in srgb, var(--ds-accent) 10%, transparent);
    font-size: 11px;
    line-height: 1.4;
    color: var(--color-text);
}
.display-sensei-body .ds-hint {
    font-size: 10px;
    line-height: 1.4;
    color: var(--color-subtle_text);
}
.display-sensei-body .ds-code {
    font-family: var(--font-code);
    color: var(--color-text);
}

.display-sensei-body .ds-grid-2 {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 4px;
}
.display-sensei-body .ds-grid-3 {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 4px;
}
.display-sensei-body .ds-grid-4 {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 4px;
}

.display-sensei-body .ds-grid-5 {
    display: grid;
    grid-template-columns: repeat(5, minmax(0, 1fr));
    gap: 4px;
}

.display-sensei-body .ds-card-head {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 6px;
}
.display-sensei-body .ds-transform-box .ds-card-head h5 {
    flex: 1 1 auto;
    min-width: 0;
    margin: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.display-sensei-body .ds-chip {
    flex: 0 0 auto;
    padding: 1px 8px;
    border: 1px solid var(--ds-outline);
    border-radius: 999px;
    font-size: 10px;
    line-height: 16px;
    white-space: nowrap;
    color: var(--color-subtle_text);
}
.display-sensei-body .ds-chip.custom {
    border-color: var(--ds-accent);
    background: color-mix(in srgb, var(--ds-accent) 18%, transparent);
    color: var(--color-text);
}
.display-sensei-body .ds-transform-box .ds-card-key {
    margin-bottom: 4px;
}
.display-sensei-body .ds-transform-box .ds-hint + .ds-card-note,
.display-sensei-body .ds-transform-box .ds-card-note + .ds-hint {
    margin-top: 6px;
}

.display-sensei-body .ds-check-group {
    margin: 8px 0;
}
.display-sensei-body .ds-check-row {
    display: flex;
    align-items: center;
    gap: 8px;
    min-height: 24px;
    padding: 2px 0;
    margin: 0;
    font-size: 11px;
    color: var(--color-text);
    cursor: pointer;
}
.display-sensei-body .ds-check-row > span {
    flex: 1 1 auto;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    line-height: 1.4;
}
.display-sensei-body .ds-check-row > input[type="checkbox"] {
    flex: 0 0 14px;
    width: 14px;
    min-width: 0;
    height: 14px;
    margin: 0;
    appearance: none;
    display: inline-grid;
    place-content: center;
    border: 1px solid var(--ds-outline);
    border-radius: 2px;
    background: var(--color-back);
    cursor: pointer;
}
.display-sensei-body .ds-check-row > input[type="checkbox"]::before {
    content: '\\2713';
    font-family: inherit;
    font-weight: normal;
    font-size: 10px;
    line-height: 1;
    color: var(--ds-on-accent);
    transform: scale(0);
    transition: transform 80ms ease-in-out;
}
.display-sensei-body .ds-check-row > input[type="checkbox"]:checked {
    border-color: var(--ds-accent-strong);
    background: var(--ds-accent-strong);
}
.display-sensei-body .ds-check-row > input[type="checkbox"]:checked::before {
    transform: scale(1);
}
.display-sensei-body .ds-check-row > input[type="checkbox"]:focus-visible {
    box-shadow: 0 0 0 1px var(--ds-accent-strong);
}
.display-sensei-body .ds-check-row.ds-check-sub {
    padding-left: 22px;
}

.display-sensei-body .ds-channel-tabs {
    margin-bottom: 8px;
}
.display-sensei-body .ds-channel {
    margin-bottom: 8px;
}
.display-sensei-body .ds-channel .ds-check-row {
    margin-bottom: 2px;
}
.display-sensei-body .ds-pos-labels {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 4px;
    margin-bottom: 2px;
    font-size: 10px;
    color: var(--color-subtle_text);
    text-align: center;
}
.display-sensei-body .ds-pos-inputs {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 4px;
    margin-bottom: 6px;
}
.display-sensei-body .ds-field {
    margin-bottom: 6px;
}
.display-sensei-body .ds-flex-row {
    display: flex;
    align-items: center;
    gap: 4px;
}
.display-sensei-body .ds-flex-row > select {
    flex: 1 1 auto;
    min-width: 0;
}
.display-sensei-body .ds-row-label {
    flex: 0 0 auto;
    font-size: 11px;
    color: var(--color-subtle_text);
}
.display-sensei-body .ds-nudge-grid {
    display: grid;
    grid-template-columns: repeat(6, minmax(0, 1fr));
    gap: 4px;
}
.display-sensei-body .ds-nudge-grid button,
.display-sensei-body .ds-quick-grid button {
    padding: 4px 2px;
}
.display-sensei-body input[type="range"] {
    display: block;
    width: 100%;
    min-width: 0;
    height: 24px;
    margin: 0 0 4px 0;
    --color-thumb: var(--ds-accent);
}
.display-sensei-body .ds-slider-row {
    display: flex;
    align-items: center;
    gap: 4px;
    margin-bottom: 4px;
}
.display-sensei-body .ds-slider-row input[type="range"] {
    flex: 1 1 auto;
    margin: 0;
}
.display-sensei-body .ds-axis-toggle {
    flex: 0 0 auto;
}
.display-sensei-body .ds-axis-toggle button {
    width: 24px;
    padding: 4px 0;
}
.display-sensei-body .ds-turn-row {
    display: flex;
    align-items: center;
    gap: 4px;
    margin-top: 4px;
}
.display-sensei-body .ds-turn-row .ds-grid-3 {
    flex: 1 1 auto;
    min-width: 0;
}
.display-sensei-body .ds-item-turn {
    display: flex;
    flex-direction: column;
    gap: 4px;
    margin-top: 6px;
}
.display-sensei-body .ds-gimbal-note {
    display: flex;
    flex-direction: column;
    gap: 4px;
    margin: 0 0 6px 0;
}
.display-sensei-body .ds-gimbal-note button {
    min-width: 0;
    height: auto;
    min-height: 24px;
    white-space: normal;
}
.display-sensei-body .ds-match-row {
    display: flex;
    flex-direction: column;
    margin: 0 0 8px 0;
}
.display-sensei-body .ds-match-row .ds-icon-button {
    justify-content: center;
}

.display-sensei-body .ds-collapse {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    margin-bottom: 8px;
    text-align: left;
}
.display-sensei-body .ds-collapse .material-icons {
    font-size: 16px;
    transition: transform 120ms ease;
}
.display-sensei-body .ds-collapse.open .material-icons {
    transform: rotate(180deg);
}

.display-sensei-body .ds-card-actions {
    display: flex;
    flex-direction: column;
    gap: 4px;
    margin-bottom: 10px;
}
.display-sensei-body .ds-preset-row {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    gap: 4px;
}
.display-sensei-body .ds-preset-row button {
    min-width: 64px;
}
.display-sensei-body .ds-slot-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
    margin-top: 4px;
}
.display-sensei-body .ds-slot-actions button {
    flex: 1 1 0;
    min-width: max-content;
}

.display-sensei-body .ds-output-code {
    min-height: 80px;
    font-family: var(--font-code);
    font-size: 10px;
    tab-size: 2;
    white-space: pre;
    overflow: auto;
}
.display-sensei-body .ds-output-code::placeholder {
    color: var(--color-subtle_text);
    white-space: pre-wrap;
}
.display-sensei-body .ds-output-actions {
    margin: 6px 0;
}
.display-sensei-body .ds-output-version {
    margin: 6px 0;
    font-size: 11px;
    color: var(--color-text);
}
.display-sensei-body .ds-output-version + .ds-card-note {
    margin-bottom: 6px;
}
.display-sensei-body .ds-output-label {
    margin-top: 8px;
}
.display-sensei-body .ds-empty-note {
    padding: 8px 10px;
    border-left: 3px solid var(--ds-outline);
    border-radius: 3px;
    background: color-mix(in srgb, var(--color-text) 4%, transparent);
    font-size: 11px;
    line-height: 1.4;
    color: var(--color-subtle_text);
}

.display-sensei-body .ds-link-card {
    border-left-color: var(--ds-accent-strong);
}
.display-sensei-body .ds-link-card > * + * {
    margin-top: 6px;
}
.display-sensei-body .ds-link-line {
    color: var(--color-text);
    overflow-wrap: anywhere;
}
.display-sensei-body .ds-link-packs p + p {
    margin-top: 2px;
}
.display-sensei-body .ds-link-files {
    display: flex;
    flex-direction: column;
    gap: 2px;
}
.display-sensei-body .ds-link-files .ds-section-label {
    margin: 4px 0 0 0;
}
.display-sensei-body .ds-link-file {
    padding: 4px 6px;
    border-radius: 3px;
    background: color-mix(in srgb, var(--color-text) 4%, transparent);
}
.display-sensei-body .ds-link-file-head,
.display-sensei-body .ds-link-file-detail {
    display: flex;
    align-items: center;
    gap: 4px;
}
.display-sensei-body .ds-link-file-detail {
    margin-top: 2px;
}
.display-sensei-body .ds-link-file-head .ds-code {
    flex: 1 1 0;
    min-width: 0;
    font-size: 10px;
    overflow-wrap: anywhere;
}
.display-sensei-body .ds-link-file-detail .ds-hint {
    flex: 1 1 0;
    min-width: 0;
}
.display-sensei-body .ds-link-file.ds-link-absent .ds-code {
    color: var(--color-subtle_text);
}
.display-sensei-body .ds-link-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
    margin-top: 8px;
}
.display-sensei-body .ds-link-actions button {
    flex: 1 1 0;
    min-width: max-content;
}

.display-sensei-body .ds-info-actions {
    display: flex;
    margin-top: 8px;
}
.display-sensei-body .ds-info-actions .ds-icon-button {
    flex: 1 1 auto;
    justify-content: center;
}

.display-sensei-body .ds-armor-card .ds-card-note {
    margin-top: 6px;
}
.display-sensei-body .ds-armor-kind {
    margin-top: 6px;
}
.display-sensei-body .ds-armor-view-label {
    margin: 4px 0 0 0;
}
.display-sensei-body .ds-armor-view .ds-view-head .ds-armor-view-label {
    flex: 1 1 auto;
    min-width: 0;
    margin: 0;
}
.display-sensei-body .ds-armor-wide-button {
    justify-content: center;
    width: 100%;
}
.display-sensei-body .ds-armor-poses {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
}
.display-sensei-body .ds-armor-poses button {
    flex: 1 1 auto;
    min-width: max-content;
}
.display-sensei-body .ds-armor-section {
    display: flex;
    flex-direction: column;
    gap: 4px;
    margin-top: 8px;
}
.display-sensei-body .ds-armor-section > .ds-section-label {
    margin-bottom: 0;
}
.display-sensei-body .ds-armor-check {
    padding: 4px 6px;
    border-left: 3px solid var(--ds-outline);
    border-radius: 3px;
    background: color-mix(in srgb, var(--color-text) 4%, transparent);
}
.display-sensei-body .ds-armor-check.ds-severity-error {
    border-left-color: var(--color-error);
}
.display-sensei-body .ds-armor-check.ds-severity-warning {
    border-left-color: var(--color-warning);
}
.display-sensei-body .ds-armor-check.ds-severity-info {
    border-left-color: var(--ds-accent);
}
.display-sensei-body .ds-armor-check-head {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 4px;
    margin-bottom: 2px;
}
.display-sensei-body .ds-chip.ds-chip-error {
    border-color: var(--color-error);
    color: var(--color-text);
}
.display-sensei-body .ds-chip.ds-chip-warning {
    border-color: var(--color-warning);
    color: var(--color-text);
}
.display-sensei-body .ds-armor-check-text {
    font-size: 11px;
    line-height: 1.4;
    color: var(--color-text);
    overflow-wrap: anywhere;
}
.display-sensei-body .ds-armor-fixes {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
    margin-top: 4px;
}
.display-sensei-body .ds-armor-fixes button {
    flex: 1 1 auto;
    min-width: max-content;
}
.display-sensei-body .ds-armor-fit .ds-channel-tabs {
    margin-bottom: 0;
}
.display-sensei-body .ds-armor-fit-name {
    margin-bottom: 2px;
    font-size: 11px;
    line-height: 1.4;
    color: var(--color-text);
    overflow-wrap: anywhere;
}
.display-sensei-body .ds-armor-fit-bone .ds-pos-inputs {
    margin-bottom: 2px;
}
.display-sensei-body .ds-armor-fit-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
    margin-top: 2px;
}
.display-sensei-body .ds-armor-fit-actions button {
    flex: 1 1 0;
    min-width: max-content;
}
.display-sensei-body .ds-armor-facts-toggle {
    margin: 8px 0 4px 0;
}
.display-sensei-body .ds-armor-facts {
    display: flex;
    flex-direction: column;
    gap: 4px;
}
.display-sensei-body .ds-armor-facts .ds-armor-fact {
    margin: 0;
}
.display-sensei-body .ds-armor-fact {
    font-size: 11px;
    line-height: 1.4;
    color: var(--color-text);
    overflow-wrap: anywhere;
}
.display-sensei-body .ds-armor-fact .ds-chip {
    margin-right: 2px;
}

.display-sensei-body fieldset.ds-channel {
    min-width: 0;
    margin: 0 0 8px 0;
    padding: 0;
    border: 0;
}
.display-sensei-body fieldset.ds-channel:disabled {
    opacity: 0.6;
}
.display-sensei-body [data-ds-hold-key] .ds-code {
    overflow-wrap: anywhere;
}
.display-sensei-body .ds-hold-write .ds-hold-file {
    margin: 4px 0;
    overflow-wrap: anywhere;
}
.display-sensei-body .ds-hold-write .ds-wide-button {
    width: 100%;
    margin-top: 2px;
}
.display-sensei-body .ds-transform-box > .ds-armor-check {
    margin-top: 6px;
}
`;

function injectPanelCss() {
    let deletable = Blockbench.addCSS(DS_PANEL_CSS, '');
    let styleNode = document.head.lastElementChild;
    if (styleNode && styleNode.tagName === 'STYLE') {
        styleNode.id = CSS_STYLE_ID;
    }
    return deletable;
}

// ---- src/panel_layout.js ----

// =========================
// Panel layout: Float / Dock / Tab
// =========================
const PREFERRED_TAB_HOST_ID = 'outliner';

function getPanelMode() {
    let panel = getPanel();
    if (panel && panel.attached_to) return 'tabbed';
    if (panel && panel.slot === 'float') return 'floating';
    return 'docked';
}

function dockPanel(panel) {
    panel.fixed_height = false;
    panel.moveTo('right_bar');
}

// =========================
// Filling the space it is in
// =========================
let grownHostId = null;

function setHostGrowing(host, growing) {
    if (host && host.container) host.container.style.flexGrow = growing ? '1' : '';
}

function fillPanelSpace() {
    let panel = getPanel();
    let host = panel ? panel.getHostPanel() : null;
    let wanted = host && host !== panel && !host.growable && host.isInSidebar() ? host : null;
    if (grownHostId && (!wanted || wanted.id !== grownHostId)) {
        setHostGrowing(Panels[grownHostId], false);
        grownHostId = null;
    }
    if (wanted) {
        setHostGrowing(wanted, true);
        grownHostId = wanted.id;
    }
}

function releaseFilledSpace() {
    if (grownHostId) setHostGrowing(Panels[grownHostId], false);
    grownHostId = null;
}

function setPanelFloating(shouldFloat) {
    let panel = getPanel();
    if (!panel) return false;
    if (shouldFloat) {
        panel.moveTo('float');
    } else {
        dockPanel(panel);
    }
    focusPanel();
    return true;
}

function findTabHostPanel() {
    let panel = getPanel();
    let candidates = [Panels[PREFERRED_TAB_HOST_ID]].concat(Interface.getRightPanels());
    let host = candidates.find(candidate => (
        candidate &&
        candidate !== panel &&
        !candidate.attached_to &&
        candidate.slot === 'right_bar' &&
        Condition(candidate.condition)
    ));
    return host || null;
}

function setPanelTabbed() {
    let panel = getPanel();
    if (!panel) return false;
    let host = findTabHostPanel();
    if (!host) {
        setPanelFloating(false);
        return false;
    }
    panel.fixed_height = false;
    host.attachPanel(panel);
    focusPanel();
    return true;
}

function focusPanel() {
    let panel = getPanel();
    if (!panel) return;

    if (Blockbench.isMobile) {
        Interface.PanelSelectorVue.select(panel);
        refreshPanel();
        return;
    }

    let host = panel.getHostPanel();
    let hostIsShown = host && host.slot !== 'hidden' && Condition(host.condition);
    if (panel.slot === 'hidden' || (panel.attached_to && !hostIsShown)) {
        dockPanel(panel);
        host = null;
    }

    let container = host || panel;
    if (container.folded) {
        container.fold(false);
    }
    if (host) {
        host.selectTab(panel);
    }
    if (container.slot === 'float') {
        container.moveToFront();
    }
    if (container.slot === 'right_bar' && !Prop.show_right_bar) {
        Interface.toggleSidebar('right', true);
    }
    if (container.slot === 'left_bar' && !Prop.show_left_bar) {
        Interface.toggleSidebar('left', true);
    }
    updateInterface();
    refreshPanel();
}

// =========================
// Before the panel is deleted
// =========================
function releaseAttachedPanels(panel) {
    let sidebar = panel.isInSidebar() ? panel.slot : 'right_bar';
    panel.getAttachedPanels().forEach(guest => guest.moveTo(sidebar));
    Object.values(Panels).forEach(other => {
        Object.values(other.mode_position_data).forEach(layout => {
            if (layout.attached_to === panel.id) {
                layout.attached_to = '';
                layout.attached_index = 0;
                layout.slot = sidebar;
            }
        });
    });
}

function removeFromFloatingOrder(panel) {
    let index = Panel.floating_panel_z_order.indexOf(panel.id);
    if (index !== -1) {
        Panel.floating_panel_z_order.splice(index, 1);
    }
}

// ---- src/panel_ui.js ----

// =========================
// Panel UI
// =========================
const PANEL_ID = 'display_sensei_panel';
const UI_STATE_STORAGE_KEY = 'display_sensei_ui_state_v1';

const MAIN_TABS = [
    {
        id: 'hand',
        label: 'display_sensei.tab.hand',
        subtabs: [
            { id: 'first_person', label: 'display_sensei.subtab.first_person', info: 'display_sensei.info.first_person' },
            { id: 'third_back', label: 'display_sensei.subtab.third_back', info: 'display_sensei.info.third_back' },
            { id: 'third_front', label: 'display_sensei.subtab.third_front', info: 'display_sensei.info.third_front' }
        ]
    },
    {
        id: 'world',
        label: 'display_sensei.tab.world',
        subtabs: [
            { id: 'item_frame', label: 'display_sensei.subtab.item_frame', info: 'display_sensei.info.item_frame' },
            { id: 'ground', label: 'display_sensei.subtab.ground', info: 'display_sensei.info.ground' },
            { id: 'shelf', label: 'display_sensei.subtab.shelf', info: 'display_sensei.info.shelf' },
            { id: 'flower_pot', label: 'display_sensei.subtab.flower_pot', info: 'display_sensei.info.flower_pot' }
        ]
    },
    {
        id: 'inventory',
        label: 'display_sensei.tab.inventory',
        subtabs: [
            { id: 'gui', label: 'display_sensei.subtab.gui', info: 'display_sensei.info.gui' },
            { id: 'head', label: 'display_sensei.subtab.head', info: 'display_sensei.info.head' }
        ]
    },
    {
        id: 'armor',
        label: 'display_sensei.tab.armor',
        subtabs: WEAR_SLOTS.map(wear => ({ id: wear.id, label: wear.label, info: wear.info }))
    },
    { id: 'output', label: 'display_sensei.tab.output', subtabs: [] }
];

const HANDS = [
    { id: 'right', label: 'display_sensei.ui.right_hand', short: 'display_sensei.ui.right' },
    { id: 'left', label: 'display_sensei.ui.left_hand', short: 'display_sensei.ui.left' }
];

const ROUTES = [
    {
        id: 'block', formatId: BLOCK_FORMAT_ID,
        label: 'display_sensei.route.block', hint: 'display_sensei.route.block_hint', output: 'display_sensei.ui.output_block'
    },
    {
        id: 'attachable', formatId: ATTACHABLE_FORMAT_ID,
        label: 'display_sensei.route.attachable', hint: 'display_sensei.route.attachable_hint', output: 'display_sensei.ui.output_attachable'
    },
    {
        id: 'entity', formatId: ENTITY_FORMAT_ID,
        label: 'display_sensei.route.entity', hint: 'display_sensei.route.entity_hint', output: 'display_sensei.ui.output_entity'
    }
];

const INFO_CARDS = {
    icon: { title: 'display_sensei.info.icon_title', text: 'display_sensei.info.icon', tip: 'display_sensei.info.icon_tip' },
    block_only: { title: 'display_sensei.info.block_only_title', text: 'display_sensei.info.block_only', tip: 'display_sensei.info.block_only_tip' },
    mob: { title: 'display_sensei.info.mob_title', text: 'display_sensei.info.mob', tip: 'display_sensei.info.mob_tip' },
    worn_body: { title: 'display_sensei.info.worn_body_title', text: 'display_sensei.info.worn_body', tip: 'display_sensei.info.worn_body_tip' },
    offhand_pointer: {
        title: 'display_sensei.info.offhand_pointer_title',
        text: 'display_sensei.info.offhand_pointer_block',
        tip: 'display_sensei.info.offhand_pointer_block_tip',
        routeTexts: { attachable: 'display_sensei.info.offhand_pointer_attachable' },
        routeTips: { attachable: 'display_sensei.info.offhand_pointer_attachable_tip' }
    },
    worn_pointer: { title: 'display_sensei.info.worn_pointer_title', text: 'display_sensei.info.worn_pointer', tip: 'display_sensei.info.worn_pointer_tip' },
    held_worn: { title: 'display_sensei.hold.worn_title', text: 'display_sensei.hold.worn', tip: 'display_sensei.hold.worn_tip' }
};

// =========================
// Your pack (Output tab)
// =========================
const LINK_EMPTY_TEXTS = {
    no_path: 'display_sensei.link.empty_no_path',
    not_in_pack: 'display_sensei.link.empty_not_in_pack',
    desktop_only: 'display_sensei.link.empty_desktop_only',
    error: 'display_sensei.link.empty_error'
};

const LINK_EMPTY_TIPS = {
    not_in_pack: 'display_sensei.link.empty_not_in_pack_tip'
};

const LINK_FILE_GROUPS = [
    { id: 'rp', label: 'display_sensei.link.files_rp' },
    { id: 'bp', label: 'display_sensei.link.files_bp' },
    { id: 'maybe_game', label: 'display_sensei.link.files_maybe_game' },
    { id: 'game', label: 'display_sensei.link.files_game' }
];

function getLinkFileGroupId(row) {
    return row.maybe_game ? 'maybe_game' : row.pack;
}

const LINK_ROLES_USING_ID = ['block', 'attachable', 'client_entity'];

const LINK_ROLE_NAMES = {
    geometry: 'display_sensei.link_role.geometry',
    attachable: 'display_sensei.link_role.attachable',
    client_entity: 'display_sensei.link_role.client_entity',
    animation: 'display_sensei.link_role.animation',
    render_controller: 'display_sensei.link_role.render_controller',
    texture: 'display_sensei.link_role.texture',
    item_texture: 'display_sensei.link_role.item_texture',
    icon: 'display_sensei.link_role.icon',
    spawn_egg: 'display_sensei.link_role.spawn_egg',
    terrain_texture: 'display_sensei.link_role.terrain_texture',
    flipbook: 'display_sensei.link_role.flipbook',
    item: 'display_sensei.link_role.item',
    entity: 'display_sensei.link_role.entity',
    block: 'display_sensei.link_role.block',
    lang: 'display_sensei.link_role.lang',
    sounds: 'display_sensei.link_role.sounds',
    blocks_json: 'display_sensei.link_role.blocks_json',
    manifest: 'display_sensei.link_role.manifest',
    pack_icon: 'display_sensei.link_role.pack_icon'
};

const WIZARD_NAMES = {
    item: 'display_sensei.wizard_name.item',
    block: 'display_sensei.wizard_name.block',
    entity: 'display_sensei.wizard_name.entity'
};

const ITEM_WIZARD_PRESET_NAMES = {
    iron_ingot: 'display_sensei.wizard_preset.iron_ingot',
    apple: 'display_sensei.wizard_preset.apple',
    sword: 'display_sensei.wizard_preset.sword',
    pickaxe: 'display_sensei.wizard_preset.pickaxe',
    helmet: 'display_sensei.wizard_preset.helmet',
    chestplate: 'display_sensei.wizard_preset.chestplate',
    leggings: 'display_sensei.wizard_preset.leggings',
    boots: 'display_sensei.wizard_preset.boots'
};

const LINK_NOTE_TEXTS = {
    no_entity_file: 'display_sensei.link_note.no_entity_file',
    wearable_armor: 'display_sensei.link_note.wearable_armor',
    wearable_offhand: 'display_sensei.link_note.wearable_offhand',
    mount_slot: 'display_sensei.link_note.mount_slot',
    hand_equipped: 'display_sensei.link_note.hand_equipped',
    glint: 'display_sensei.link_note.glint',
    use_animation: 'display_sensei.link_note.use_animation',
    saves_into: 'display_sensei.link_note.saves_into',
    own_model: 'display_sensei.wizard_note.own_model',
    block_wizard_version: 'display_sensei.wizard_note.block_wizard_version'
};

const LINK_NOTE_TIPS = {
    no_entity_file: 'display_sensei.link_note.no_entity_file_tip',
    wearable_armor: 'display_sensei.link_note.wearable_armor_tip',
    wearable_offhand: 'display_sensei.link_note.wearable_offhand_tip',
    mount_slot: 'display_sensei.link_note.mount_slot_tip',
    hand_equipped: 'display_sensei.link_note.hand_equipped_tip',
    glint: 'display_sensei.link_note.glint_tip',
    use_animation: 'display_sensei.link_note.use_animation_tip',
    own_model: 'display_sensei.wizard_note.own_model_tip',
    block_wizard_version: 'display_sensei.wizard_note.block_wizard_version_tip'
};

const WIZARD_REEXPORT_TEXTS = {
    item: 'display_sensei.wizard_note.reexport_item',
    block: 'display_sensei.wizard_note.reexport_block',
    entity: 'display_sensei.wizard_note.reexport_entity'
};

const WIZARD_REEXPORT_TIPS = {
    item: 'display_sensei.wizard_note.reexport_item_tip',
    block: 'display_sensei.wizard_note.reexport_block_tip',
    entity: 'display_sensei.wizard_note.reexport_entity_tip'
};

const WIZARD_REWRITTEN_HINTS = {
    item: 'display_sensei.link.rewritten_hint_item',
    block: 'display_sensei.link.rewritten_hint_block',
    entity: 'display_sensei.link.rewritten_hint_entity'
};

const BLOCK_WIZARD_LOSS_TEXTS = {
    shelf: 'display_sensei.wizard_feature.shelf',
    fit_to_frame_off: 'display_sensei.wizard_feature.fit_to_frame_off'
};

const HAND_CARD_NOTE_IDS = ['wearable_armor', 'mount_slot'];

const ARMOR_CARD_NOTE_IDS = ['wearable_offhand', 'mount_slot'];

// =========================
// Block route editor: controls
// =========================
const CHANNEL_TABS = [
    { id: 'translation', label: 'display_sensei.ui.translation' },
    { id: 'rotation', label: 'display_sensei.ui.rotation' },
    { id: 'scale', label: 'display_sensei.ui.scale' }
];

const PIVOT_CHANNELS = [
    { id: 'rotation_pivot', label: 'display_sensei.ui.rotation_pivot' },
    { id: 'scale_pivot', label: 'display_sensei.ui.scale_pivot' }
];

const CHANNEL_LABELS = {
    translation: 'display_sensei.ui.translation',
    rotation: 'display_sensei.ui.rotation',
    scale: 'display_sensei.ui.scale',
    rotation_pivot: 'display_sensei.ui.rotation_pivot',
    scale_pivot: 'display_sensei.ui.scale_pivot'
};

const FIRST_PERSON_FRAME_NOTE = {
    id: 'first_person_frame', text: 'display_sensei.info.first_person_frame', tip: 'display_sensei.info.first_person_frame_tip'
};
const BEDROCK_DIFFERENCE_NOTES = {
    firstperson_righthand: FIRST_PERSON_FRAME_NOTE,
    firstperson_lefthand: FIRST_PERSON_FRAME_NOTE,
    head: { id: 'head_wearable', text: 'display_sensei.info.head_wearable', tip: 'display_sensei.info.head_wearable_tip' },
    on_shelf: { id: 'shelf_alignment', text: 'display_sensei.info.shelf_alignment', tip: 'display_sensei.info.shelf_alignment_tip' }
};
const SHARED_THIRD_PERSON_NOTE = { id: 'shared_third_person', text: 'display_sensei.info.third_front_shared' };

const AXIS_LETTERS = ['X', 'Y', 'Z'];

const MOVE_STEPS = [0.1, 0.25, 0.5, 1, 2, 4];
const DEFAULT_MOVE_STEP = 0.5;

const INPUT_STEPS = { rotation: 1, scale: 0.05, rotation_pivot: 0.05, scale_pivot: 0.05 };

const NUDGE_BUTTONS = [
    { id: 'x-', axis: 0, sign: -1 }, { id: 'x+', axis: 0, sign: 1 },
    { id: 'y-', axis: 1, sign: -1 }, { id: 'y+', axis: 1, sign: 1 },
    { id: 'z-', axis: 2, sign: -1 }, { id: 'z+', axis: 2, sign: 1 }
];

const NUDGE_REPEAT_DELAY_MS = 400;
const NUDGE_REPEAT_INTERVAL_MS = 60;

const ROTATION_SLIDER_RANGE = [-180, 180];
const ROTATION_QUICK_VALUES = [-90, 0, 45, 90, 180];

const SCALE_QUICK_VALUES = [0.25, 0.375, 0.5, 0.625, 1, 1.5];
const SCALE_SLIDER_STEP = 0.005;

const POSE_ANGLE_STEP = 0.5;

const BACK_CAMERA_OPTIONS = [
    { id: 'shoulder', label: 'display_sensei.ui.back_camera_shoulder', hint: 'display_sensei.ui.back_camera_shoulder_hint' },
    { id: 'straight', label: 'display_sensei.ui.back_camera_straight', hint: 'display_sensei.ui.back_camera_straight_hint' }
];

const PRESET_SCOPES = [
    { id: 'context', label: 'display_sensei.ui.preset_scope_context' },
    { id: 'all', label: 'display_sensei.ui.preset_scope_all' }
];

const BLOCKBENCH_REFERENCE_NAMES = {
    block: 'display_sensei.reference.block'
};

const FIT_PREVIEW_OPTION_ID = 'fit_preview';

const SAVED_PRESET_GROUP = { id: 'saved', label: 'display_sensei.ui.saved_presets' };

const CALIBRATION_ACTIONS = [
    { id: 'item_hold', name: 'display_sensei.preset.item_hold', label: 'display_sensei.ui.calibrate_item_hold', hint: 'display_sensei.ui.calibrate_item_hold_hint' },
    { id: 'tool_hold', name: 'display_sensei.preset.tool_hold', label: 'display_sensei.ui.calibrate_tool_hold', hint: 'display_sensei.ui.calibrate_tool_hold_hint' }
];

const ITEM_TURN_STEP = 5;

const HAND_VIEW_SIZE = [320, 180];
const HAND_VIEW_REFRESH_MS = 120;

// =========================
// Held 3D items: controls
// =========================
const HOLD_EDITOR_CHANNELS = { translation: 'position', rotation: 'rotation', scale: 'scale' };

const HOLD_SLIDER_RANGES = Object.freeze({ translation: [-48, 48], rotation: ROTATION_SLIDER_RANGE, scale: [0, 4] });

const HOLD_INPUT_LIMITS = Object.freeze({ translation: HOLD_RANGES.position, rotation: HOLD_RANGES.rotation, scale: HOLD_RANGES.scale });

const HOLD_PRESET_SCOPES = [
    { id: 'context', label: 'display_sensei.hold.preset_scope_view' },
    { id: 'all', label: 'display_sensei.hold.preset_scope_both' }
];

const HOLD_STATUS_NOTES = {
    missing: { text: 'display_sensei.hold.note_missing', tip: 'display_sensei.hold.note_missing_tip' },
    new: { text: 'display_sensei.hold.note_new', tip: 'display_sensei.hold.note_new_tip' },
    stacked: { text: 'display_sensei.hold.note_stacked', tip: 'display_sensei.hold.note_stacked_tip' },
    controller: { text: 'display_sensei.hold.note_controller', tip: 'display_sensei.hold.note_controller_tip' }
};

const HOLD_REASON_NOTES = {
    animated: { text: 'display_sensei.hold.note_animated', tip: 'display_sensei.hold.note_animated_tip' },
    molang: { text: 'display_sensei.hold.note_molang', tip: 'display_sensei.hold.note_animated_tip' },
    no_bone: { text: 'display_sensei.hold.note_no_bone', tip: 'display_sensei.hold.note_no_bone_tip' }
};

const HOLD_CHECK_TEXTS = {
    no_hand_binding: { text: 'display_sensei.hold_check.no_hand_binding', tip: 'display_sensei.hold_check.no_hand_binding_tip' },
    loose_roots: { text: 'display_sensei.hold_check.loose_roots', tip: 'display_sensei.hold_check.loose_roots_tip' },
    far_from_hand: { text: 'display_sensei.hold_check.far_from_hand', tip: 'display_sensei.hold_check.far_from_hand_tip' }
};

const HOLD_FIX_LABELS = {
    bind_root: { label: 'display_sensei.hold_check.fix_bind_root', hint: 'display_sensei.hold_check.fix_bind_root_hint' },
    move_into_bound: { label: 'display_sensei.hold_check.fix_move_into_bound', hint: 'display_sensei.hold_check.fix_move_into_bound_hint' }
};

const HOLD_VIEW_NAMES = {
    first_person: 'display_sensei.hold.view_first_person',
    third_person: 'display_sensei.hold.view_third_person'
};

const HOLD_WRITE_MESSAGES = {
    written: 'display_sensei.message.hold_written',
    nothing: 'display_sensei.message.hold_nothing',
    no_file: 'display_sensei.message.hold_no_file',
    missing_file: 'display_sensei.message.hold_missing_file',
    unreadable: 'display_sensei.message.hold_unreadable',
    failed: 'display_sensei.message.hold_failed',
    loaded: 'display_sensei.message.hold_loaded',
    desktop_only: 'display_sensei.message.hold_desktop_only'
};

const HOLD_MATCH_STARTS = {
    file: 'display_sensei.message.hold_match_from_file',
    item_wizard_tool: 'display_sensei.message.hold_match_from_tool'
};

// =========================
// Armor card: controls
// =========================
const WEAR_KINDS = [
    { id: 'auto', label: 'display_sensei.armor.kind_auto' },
    { id: 'armor', label: 'display_sensei.armor.kind_armor' },
    { id: 'worn', label: 'display_sensei.armor.kind_worn' },
    { id: 'held', label: 'display_sensei.armor.kind_held' }
];

const WEAR_KIND_TEXTS = {
    armor: { text: 'display_sensei.armor.detected_armor', tip: 'display_sensei.armor.detected_armor_tip' },
    worn: { text: 'display_sensei.armor.detected_worn', tip: 'display_sensei.armor.detected_worn_tip' },
    held: { text: 'display_sensei.armor.detected_held', tip: 'display_sensei.armor.detected_held_tip' },
    unknown: { text: 'display_sensei.armor.detected_unknown', tip: 'display_sensei.armor.detected_unknown_tip' }
};
const HELD_IN_SLOT_TEXT = { text: 'display_sensei.armor.detected_held_slot', tip: 'display_sensei.armor.detected_held_tip' };
const WORN_ELSEWHERE_TEXT = { text: 'display_sensei.armor.detected_worn_elsewhere', tip: 'display_sensei.armor.detected_worn_elsewhere_tip' };

const WEAR_SOURCE_TEXTS = {
    saved: { text: 'display_sensei.armor.source_saved' },
    pack: { text: 'display_sensei.armor.source_pack', tip: 'display_sensei.armor.source_pack_tip' },
    file: { text: 'display_sensei.armor.source_file', tip: 'display_sensei.armor.source_file_tip' },
    bones: { text: 'display_sensei.armor.source_bones', tip: 'display_sensei.armor.source_bones_tip' }
};

const ARMOR_OVERLAY_TOGGLES = [
    { id: 'show', label: 'display_sensei.armor.overlay_show', hint: 'display_sensei.armor.overlay_show_hint' },
    { id: 'outerLayer', label: 'display_sensei.armor.overlay_outer_layer', hint: 'display_sensei.armor.overlay_outer_layer_hint' },
    { id: 'xray', label: 'display_sensei.armor.overlay_xray', hint: 'display_sensei.armor.overlay_xray_hint' }
];

const ARMOR_OTHER_SLOTS = [
    { id: 'none', label: 'display_sensei.armor.other_slots_none' },
    { id: 'grey', label: 'display_sensei.armor.other_slots_grey' },
    { id: 'flat', label: 'display_sensei.armor.other_slots_flat' }
];

const ARMOR_CAMERA_VIEWS = [
    { id: 'front', label: 'display_sensei.armor.camera_front', hint: 'display_sensei.armor.camera_front_hint' },
    { id: 'back', label: 'display_sensei.armor.camera_back', hint: 'display_sensei.armor.camera_back_hint' },
    { id: 'right', label: 'display_sensei.armor.camera_right', hint: 'display_sensei.armor.camera_right_hint' },
    { id: 'left', label: 'display_sensei.armor.camera_left', hint: 'display_sensei.armor.camera_left_hint' }
];

const ARMOR_SEVERITY_LABELS = {
    error: 'display_sensei.armor.severity_error',
    warning: 'display_sensei.armor.severity_warning',
    info: 'display_sensei.armor.severity_info'
};

const ARMOR_CHECK_TIPS = {
    'display_sensei.armor_check.nothing_follows': 'display_sensei.armor_check.nothing_follows_tip',
    'display_sensei.armor_check.slot_mix': 'display_sensei.armor_check.slot_mix_tip',
    'display_sensei.armor_check.name_alias': 'display_sensei.armor_check.name_alias_tip',
    'display_sensei.armor_check.pivot_delta': 'display_sensei.armor_check.pivot_delta_tip',
    'display_sensei.armor_check.pivot_wearer': 'display_sensei.armor_check.pivot_wearer_tip',
    'display_sensei.armor_check.reserved_marker': 'display_sensei.armor_check.reserved_marker_tip',
    'display_sensei.armor_check.nested_match': 'display_sensei.armor_check.nested_match_tip',
    'display_sensei.armor_check.bound_offset': 'display_sensei.armor_check.bound_offset_tip',
    'display_sensei.armor_check.item_slot_binding': 'display_sensei.armor_check.item_slot_binding_tip',
    'display_sensei.armor_check.binding_version': 'display_sensei.armor_check.binding_version_tip',
    'display_sensei.armor_check.clearance_inside': 'display_sensei.armor_check.clearance_inside_tip',
    'display_sensei.armor_check.clearance_flicker': 'display_sensei.armor_check.clearance_flicker_tip',
    'display_sensei.armor_check.vanilla_overlap': 'display_sensei.armor_check.vanilla_overlap_tip',
    'display_sensei.armor_check.no_parent_setup': 'display_sensei.armor_check.no_parent_setup_tip',
    'display_sensei.armor_check.target_missing': 'display_sensei.armor_check.target_missing_tip',
    'display_sensei.armor_check.wearer_hides_armor': 'display_sensei.armor_check.wearer_hides_armor_tip'
};

const ARMOR_FIX_LABELS = {
    rename: { label: 'display_sensei.armor.fix_rename', hint: 'display_sensei.armor.fix_rename_hint' },
    snap_pivot_keep: { label: 'display_sensei.armor.fix_snap_pivot_keep', hint: 'display_sensei.armor.fix_snap_pivot_keep_hint' },
    snap_pivot_move: { label: 'display_sensei.armor.fix_snap_pivot_move', hint: 'display_sensei.armor.fix_snap_pivot_move_hint' },
    flatten: { label: 'display_sensei.armor.fix_flatten', hint: 'display_sensei.armor.fix_flatten_hint' },
    wrap_pivot_parent: { label: 'display_sensei.armor.fix_wrap_pivot_parent', hint: 'display_sensei.armor.fix_wrap_pivot_parent_hint' }
};

const FIT_CHANNELS = [
    { id: 'position', label: 'display_sensei.armor.fit_position' },
    { id: 'rotation', label: 'display_sensei.ui.rotation' },
    { id: 'scale', label: 'display_sensei.ui.scale' }
];
const FIT_DEFAULTS = { position: [0, 0, 0], rotation: [0, 0, 0], scale: [1, 1, 1] };
const FIT_STEPS = { position: 0.1, rotation: 1, scale: 0.01 };
const FIT_RANGES = { position: [-16, 16], rotation: [-180, 180], scale: [0, 4] };

const ARMOR_FACTS = [
    { id: 'flat_icon', text: 'display_sensei.armor.fact_flat_icon', tip: 'display_sensei.armor.fact_flat_icon_tip' },
    { id: 'first_person', text: 'display_sensei.armor.fact_first_person', tip: 'display_sensei.armor.fact_first_person_tip' },
    { id: 'slim', text: 'display_sensei.armor.fact_slim', tip: 'display_sensei.armor.fact_slim_tip' },
    { id: 'parent_setup', text: 'display_sensei.armor.fact_parent_setup', tip: 'display_sensei.armor.fact_parent_setup_tip' },
    { id: 'trims', text: 'display_sensei.armor.fact_trims', tip: 'display_sensei.armor.fact_trims_tip' },
    { id: 'elytra', text: 'display_sensei.armor.fact_elytra', tip: 'display_sensei.armor.fact_elytra_tip' },
    { id: 'cape', text: 'display_sensei.armor.fact_cape' }
];
const ARMOR_VERSION_FACTS = [
    { version: '26.10', text: 'display_sensei.armor.version_26_10', tip: 'display_sensei.armor.version_26_10_tip' },
    { version: '26.20', text: 'display_sensei.armor.version_26_20', tip: 'display_sensei.armor.version_26_20_tip' },
    { version: '26.30', text: 'display_sensei.armor.version_26_30', tip: 'display_sensei.armor.version_26_30_tip' }
];

function readFitValues(entry) {
    let values = {};
    for (let channel of FIT_CHANNELS) {
        let stored = entry && entry[channel.id];
        values[channel.id] = Array.isArray(stored) && stored.length === 3 ? stored.slice() : FIT_DEFAULTS[channel.id].slice();
    }
    return values;
}

const PANEL_CONSTANTS = Object.freeze({
    mainTabs: MAIN_TABS,
    hands: HANDS,
    routes: ROUTES,
    channelTabs: CHANNEL_TABS,
    pivotChannels: PIVOT_CHANNELS,
    pivotMarkerColors: PIVOT_MARKER_COLORS,
    axisLetters: AXIS_LETTERS,
    moveSteps: MOVE_STEPS,
    inputSteps: INPUT_STEPS,
    nudgeButtons: NUDGE_BUTTONS,
    rotationSliderRange: ROTATION_SLIDER_RANGE,
    rotationQuickValues: ROTATION_QUICK_VALUES,
    scaleQuickValues: SCALE_QUICK_VALUES,
    scaleSliderStep: SCALE_SLIDER_STEP,
    slotRanges: SLOT_RANGES,
    presetScopes: PRESET_SCOPES,
    backCameraOptions: BACK_CAMERA_OPTIONS,
    poseAngleStep: POSE_ANGLE_STEP,
    handViewSize: HAND_VIEW_SIZE,
    itemTurnStep: ITEM_TURN_STEP,
    wearKinds: WEAR_KINDS,
    armorOverlayToggles: ARMOR_OVERLAY_TOGGLES,
    armorOtherSlots: ARMOR_OTHER_SLOTS,
    armorCameraViews: ARMOR_CAMERA_VIEWS,
    fitChannels: FIT_CHANNELS,
    fitSteps: FIT_STEPS,
    fitRanges: FIT_RANGES,
    armorFacts: ARMOR_FACTS,
    armorVersionFacts: ARMOR_VERSION_FACTS,
    holdSliderRanges: HOLD_SLIDER_RANGES,
    holdInputLimits: HOLD_INPUT_LIMITS
});

let panelInstance = null;
let panelVue = null;
const followedWearSlots = new WeakMap();

function getPanel() {
    return panelInstance;
}

function isPanelVisible() {
    return !!panelInstance && !!panelInstance.isVisible();
}

function findMainTab(tabId) {
    return MAIN_TABS.find(tab => tab.id === tabId) || null;
}

function findSubtab(tab, subtabId) {
    return tab.subtabs.find(subtab => subtab.id === subtabId) || null;
}

function findHand(handId) {
    return HANDS.find(hand => hand.id === handId) || null;
}

// =========================
// Numbers in the editor
// =========================
function roundEditorValue(value) {
    return Math.round(value * 10000) / 10000;
}

function formatEditorValue(value) {
    let rounded = roundEditorValue(Number(value) || 0);
    return String(rounded === 0 ? 0 : rounded);
}

function readTypedValue(channel, text) {
    let number = parseFloat(text);
    return Number.isFinite(number) ? sanitizeSlotValue(channel, number) : null;
}

function formatTransformsProperty(transforms) {
    let lines = compileJSON({ item_display_transforms: transforms }, { final_newline: false }).split('\n');
    let inner = lines.slice(1, -1);
    let indent = inner.length ? inner[0].match(/^\s*/)[0] : '';
    return inner.map(line => (line.startsWith(indent) ? line.slice(indent.length) : line)).join('\n');
}

function findContextsWithDefaultScale(value) {
    let defaults = getEngineDefaults();
    return BEDROCK_SLOTS
        .filter(slot => {
            let scale = defaults[slot.id] && defaults[slot.id].scale;
            return Array.isArray(scale) && scale.every(axisValue => sameNumber(axisValue, value));
        })
        .map(slot => i18n(slot.label));
}

// =========================
// Remembered UI state (last tab, sub-tab per tab, hand, editor choices)
// =========================
function getDefaultUiState() {
    return {
        tab: 'hand',
        subtabs: { hand: 'first_person', world: 'item_frame', inventory: 'gui', armor: 'slot.armor.head' },
        hand: 'right',
        channel: 'translation',
        moveStep: DEFAULT_MOVE_STEP,
        translationAxis: 0,
        rotationAxis: 0,
        scaleAxis: 0,
        scaleLocked: true,
        advancedOpen: false,
        viewOpen: true,
        handViewsOpen: true,
        presetScope: 'context',
        backCamera: 'shoulder',
        armorWearer: 'player_wide',
        armorOverlay: { show: true, outerLayer: true, otherSlots: 'none', xray: false },
        armorFitChannel: 'position',
        armorFactsOpen: false
    };
}

function loadUiState() {
    let state = getDefaultUiState();
    let stored = null;
    try {
        stored = JSON.parse(localStorage.getItem(UI_STATE_STORAGE_KEY));
    } catch (error) {
        stored = null;
    }
    if (!stored || typeof stored !== 'object') {
        return state;
    }
    if (findMainTab(stored.tab)) {
        state.tab = stored.tab;
    }
    MAIN_TABS.forEach(tab => {
        let subtabId = stored.subtabs && stored.subtabs[tab.id];
        if (findSubtab(tab, subtabId)) {
            state.subtabs[tab.id] = subtabId;
        }
    });
    if (findHand(stored.hand)) {
        state.hand = stored.hand;
    }
    if (CHANNEL_TABS.some(channel => channel.id === stored.channel)) {
        state.channel = stored.channel;
    }
    if (MOVE_STEPS.includes(stored.moveStep)) {
        state.moveStep = stored.moveStep;
    }
    for (let key of ['translationAxis', 'rotationAxis', 'scaleAxis']) {
        if ([0, 1, 2].includes(stored[key])) {
            state[key] = stored[key];
        }
    }
    if (typeof stored.scaleLocked === 'boolean') {
        state.scaleLocked = stored.scaleLocked;
    }
    if (typeof stored.advancedOpen === 'boolean') {
        state.advancedOpen = stored.advancedOpen;
    }
    if (typeof stored.viewOpen === 'boolean') {
        state.viewOpen = stored.viewOpen;
    }
    if (typeof stored.handViewsOpen === 'boolean') {
        state.handViewsOpen = stored.handViewsOpen;
    }
    if (PRESET_SCOPES.some(scope => scope.id === stored.presetScope)) {
        state.presetScope = stored.presetScope;
    }
    if (BACK_CAMERA_OPTIONS.some(option => option.id === stored.backCamera)) {
        state.backCamera = stored.backCamera;
    }
    if (getWearerChoices().some(choice => choice.id === stored.armorWearer)) {
        state.armorWearer = stored.armorWearer;
    }
    let overlay = stored.armorOverlay;
    if (overlay && typeof overlay === 'object') {
        for (let toggle of ARMOR_OVERLAY_TOGGLES) {
            if (typeof overlay[toggle.id] === 'boolean') {
                state.armorOverlay[toggle.id] = overlay[toggle.id];
            }
        }
        if (ARMOR_OTHER_SLOTS.some(choice => choice.id === overlay.otherSlots)) {
            state.armorOverlay.otherSlots = overlay.otherSlots;
        }
    }
    if (FIT_CHANNELS.some(channel => channel.id === stored.armorFitChannel)) {
        state.armorFitChannel = stored.armorFitChannel;
    }
    if (typeof stored.armorFactsOpen === 'boolean') {
        state.armorFactsOpen = stored.armorFactsOpen;
    }
    return state;
}

function saveUiState(state) {
    try {
        localStorage.setItem(UI_STATE_STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
        console.warn(LOG_PREFIX, 'Could not save the panel state:', error);
    }
}

// =========================
// X / Y / Z inputs
// =========================
const AXIS_INPUTS_TEMPLATE = `
<div class="ds-axis-inputs" :data-ds-channel="channel">
    <div class="ds-pos-labels">
        <div v-for="letter in letters" :key="letter">{{ letter }}</div>
    </div>
    <div class="ds-pos-inputs">
        <input
            v-for="(letter, axis) in letters"
            :key="letter"
            type="number"
            class="tab_target"
            :data-ds-input="channel + '.' + axis"
            :title="letter"
            :value="format(values[axis])"
            :step="step"
            :min="range[0]"
            :max="range[1]"
            @focus="rememberProject"
            @change="commit(axis, $event)"
            @keydown.enter="commit(axis, $event)"
            @keydown.esc.stop.prevent="revert(axis, $event)"
        >
    </div>
</div>
`;

function buildAxisInputsComponent() {
    return {
        name: 'display-sensei-axis-inputs',
        template: AXIS_INPUTS_TEMPLATE,
        props: {
            channel: String,
            values: Array,
            step: Number,
            limits: Array
        },
        created() {
            this.focusProject = null;
        },
        computed: {
            letters() {
                return AXIS_LETTERS;
            },
            range() {
                return this.limits || SLOT_RANGES[this.channel];
            }
        },
        methods: {
            format: formatEditorValue,
            rememberProject() {
                this.focusProject = Project;
            },
            commit(axis, event) {
                if (this.focusProject && this.focusProject !== Project) {
                    this.revert(axis, event);
                    return;
                }
                this.$emit('commit', this.channel, axis, event);
            },
            revert(axis, event) {
                event.target.value = formatEditorValue(this.values[axis]);
                event.target.blur();
            }
        }
    };
}

// =========================
// Info tips
// =========================
const TIP_TEMPLATE = `<span class="ds-tip" role="img" :title="text" :aria-label="text"></span>`;

function buildTipComponent() {
    return {
        name: 'display-sensei-tip',
        template: TIP_TEMPLATE,
        props: { text: String }
    };
}

// =========================
// Panel template
// =========================
const PANEL_TEMPLATE = `
<div class="display-sensei-body" :data-ds-route="route" :data-ds-panel-mode="panelMode">
    <div class="ds-scroll">
        <div class="ds-header">
            <div class="ds-header-text">
                <h4 class="ds-title">{{ t('display_sensei.ui.title') }}</h4>
                <p class="ds-subtitle">{{ t('display_sensei.ui.subtitle') }}</p>
            </div>
        </div>

        <div v-if="currentRoute" class="ds-route-badge" :data-ds-route="route" :title="t(currentRoute.hint)">
            <span>{{ t(currentRoute.label) }}</span>
            <span class="ds-route-format">{{ formatId }}</span>
        </div>

        <div v-else class="ds-info-card" data-ds-card="no_route">
            <h5>{{ t('display_sensei.info.no_route_title') }}</h5>
            <p>{{ t('display_sensei.info.no_route') }}</p>
            <p v-for="choice in ui.routes" :key="choice.id">
                <b>{{ t(choice.label) }}</b>
                <span class="ds-code">{{ choice.formatId }}</span><ds-tip :text="t(choice.hint)"></ds-tip>
            </p>
            <p v-if="formatId" class="ds-hint">{{ tf('display_sensei.info.current_format', { format: formatId }) }}</p>
        </div>

        <template v-if="currentRoute">
            <p v-if="entityKeepsTransforms" class="ds-card-note" data-ds-note="entity_display_kept">{{ t('display_sensei.info.entity_display_kept') }}<ds-tip :text="t('display_sensei.info.entity_display_kept_tip')"></ds-tip></p>

            <div class="ds-tabs">
                <button
                    v-for="tab in ui.mainTabs"
                    :key="tab.id"
                    type="button"
                    class="ds-tab"
                    :class="{ active: activeTab === tab.id }"
                    :data-ds-tab="tab.id"
                    @click="setMainTab(tab.id)"
                >{{ t(tab.label) }}</button>
            </div>

            <div v-if="currentSubtabs.length" class="ds-subtab-row">
                <div class="ds-subtabs" :class="'ds-grid-' + currentSubtabs.length">
                    <button
                        v-for="subtab in currentSubtabs"
                        :key="subtab.id"
                        type="button"
                        class="ds-subtab"
                        :class="{ active: activeSubtabId === subtab.id, 'ds-worn': isWornSubtab(subtab.id) }"
                        :data-ds-subtab="subtab.id"
                        :data-ds-worn="isWornSubtab(subtab.id) ? 'true' : null"
                        :title="isWornSubtab(subtab.id) ? tf('display_sensei.armor.worn_here_hint', { slot: subtab.id }) : null"
                        @click="setSubtab(subtab.id)"
                    >{{ t(subtab.label) }}</button>
                </div>
                <div v-if="activeTab === 'hand'" class="ds-hand-toggle" role="group" :aria-label="t('display_sensei.ui.hand')">
                    <button
                        v-for="handOption in ui.hands"
                        :key="handOption.id"
                        type="button"
                        class="ds-segment"
                        :class="{ active: hand === handOption.id }"
                        :title="t(handOption.label)"
                        :data-ds-hand="handOption.id"
                        @click="setHand(handOption.id)"
                    >{{ t(handOption.short) }}</button>
                </div>
            </div>

            <div
                v-if="showEditor"
                class="ds-transform-box"
                data-ds-card="edit"
                :data-ds-slot="activeSlot.id"
                :data-ds-wear-slot="activeWearSlot ? activeWearSlot.id : null"
                :data-ds-state="slotState.inherited ? 'default' : 'custom'"
                :data-ds-hold-status="isHoldEditor ? slotState.hold.status : null"
            >
                <div class="ds-card-head">
                    <h5 :title="cardNote ? t(activeSubtab.info) : null">{{ getCardTitle() }}</h5>
                    <span
                        v-if="!isHoldEditor"
                        class="ds-chip"
                        :class="{ custom: !slotState.inherited }"
                        data-ds-chip
                        :title="slotState.inherited ? t('display_sensei.ui.state_default_hint') : t('display_sensei.ui.state_custom_hint')"
                    >{{ slotState.inherited ? t('display_sensei.ui.state_default') : t('display_sensei.ui.state_custom') }}</span>
                    <span
                        v-else-if="showsOffHandChoice()"
                        class="ds-chip"
                        :class="{ custom: !slotState.inherited }"
                        data-ds-chip="off_hand"
                        :title="slotState.inherited ? t('display_sensei.hold.state_same_hint') : t('display_sensei.hold.state_own_hint')"
                    >{{ slotState.inherited ? t('display_sensei.hold.state_same') : t('display_sensei.hold.state_own') }}</span>
                </div>
                <div v-if="!isHoldEditor" class="ds-card-key"><span class="ds-code" :title="getSlotNameHint()">{{ cardTarget.key }}</span> {{ getCardTargetName() }}</div>
                <div v-else class="ds-card-key" data-ds-hold-key><span class="ds-code" data-ds-hold-animation :title="t('display_sensei.hold.animation_hint')">{{ slotState.hold.animation }}</span> <span class="ds-code" data-ds-hold-bone :title="t('display_sensei.hold.bone_hint')">{{ slotState.hold.bone }}</span></div>
                <div v-if="activeWearSlot" class="ds-card-key" data-ds-wear-key><span class="ds-code" :title="t('display_sensei.armor.wearable_slot_name')">{{ activeWearSlot.wearableSlot }}</span></div>
                <p class="ds-card-text" :data-ds-note="cardNote ? cardNote.id : null">{{ cardNote ? t(cardNote.text) : t(activeSubtab.info) }}<ds-tip v-if="getCardTextTip()" :text="getCardTextTip()"></ds-tip></p>
                <p v-for="note in getVersionNotes()" :key="note.id" class="ds-card-note" :data-ds-note="note.id">{{ note.text }}<ds-tip v-if="note.tip" :text="note.tip"></ds-tip></p>
                <p v-if="slotState.handFallbackNote" class="ds-card-note" data-ds-note="hand_fallback">{{ slotState.handFallbackNote }}</p>

                <template v-if="isHoldEditor">
                    <p v-for="note in getHoldNotes()" :key="note.id" class="ds-card-note" :data-ds-note="note.id">{{ note.text }}<ds-tip v-if="note.tip" :text="note.tip"></ds-tip></p>
                    <div v-if="!slotState.hold.editing" class="ds-info-actions">
                        <button
                            type="button"
                            class="ds-icon-button"
                            data-ds-action="hold_edit_mode"
                            :title="t('display_sensei.hold.edit_mode_hint')"
                            @click="enterEditMode"
                        ><i class="material-icons">edit</i><span>{{ t('display_sensei.hold.edit_mode') }}</span></button>
                    </div>
                    <div
                        v-for="check in holdChecks"
                        :key="check.id"
                        class="ds-armor-check"
                        :class="'ds-severity-' + check.severity"
                        :data-ds-hold-check="check.id"
                        :data-ds-severity="check.severity"
                    >
                        <div class="ds-armor-check-head">
                            <span class="ds-chip" :class="'ds-chip-' + check.severity" data-ds-chip="severity">{{ getSeverityLabel(check.severity) }}</span>
                            <span v-if="check.approximate" class="ds-chip" data-ds-chip="hold_estimate" :title="t('display_sensei.hold.estimate_hint')">{{ t('display_sensei.hold.estimate') }}</span>
                        </div>
                        <p class="ds-armor-check-text">{{ getHoldCheckText(check) }}<ds-tip :text="getHoldCheckTip(check)"></ds-tip></p>
                        <div v-if="check.fix" class="ds-armor-fixes">
                            <button
                                type="button"
                                data-ds-action="hold_fix"
                                :data-ds-fix="check.fix"
                                :title="getHoldFixHint(check)"
                                @click="applyHoldFix(check.fix)"
                            >{{ getHoldFixLabel(check) }}</button>
                        </div>
                    </div>
                </template>

                <div v-if="isHoldEditor && holdView.shown" class="ds-view" data-ds-view data-ds-hold-view>
                    <div class="ds-view-head">
                        <button
                            type="button"
                            class="ds-view-toggle"
                            :class="{ open: viewOpen }"
                            data-ds-action="toggle_view"
                            :aria-expanded="viewOpen ? 'true' : 'false'"
                            :title="t('display_sensei.ui.view_toggle_hint')"
                            @click="toggleView"
                        ><i class="material-icons">expand_more</i><span>{{ t('display_sensei.ui.view') }}</span></button>
                        <span class="ds-chip" data-ds-chip="preview_only" :title="t('display_sensei.hold.preview_only_hint')">{{ t('display_sensei.ui.preview_only') }}</span>
                        <button
                            type="button"
                            class="ds-icon-button"
                            data-ds-action="reset_view"
                            :title="t('display_sensei.hold.reset_view_hint')"
                            @click="resetView"
                        ><i class="material-icons">center_focus_strong</i><span>{{ t('display_sensei.ui.reset_view') }}</span></button>
                    </div>
                    <template v-if="viewOpen">
                        <div v-if="activeSubtabId === 'third_back'" class="ds-flex-row">
                            <span class="ds-row-label">{{ t('display_sensei.ui.back_camera') }}</span>
                            <div class="ds-segment-group" role="group" :aria-label="t('display_sensei.ui.back_camera')">
                                <button
                                    v-for="option in ui.backCameraOptions"
                                    :key="option.id"
                                    type="button"
                                    class="ds-segment"
                                    :class="{ active: backCamera === option.id }"
                                    :title="t(option.hint)"
                                    :data-ds-back-camera="option.id"
                                    @click="setBackCamera(option.id)"
                                >{{ t(option.label) }}</button>
                            </div>
                        </div>
                        <div v-if="activeSubtabId !== 'first_person'" class="ds-flex-row" :title="t('display_sensei.hold.held_by_hint')">
                            <span class="ds-row-label">{{ t('display_sensei.hold.held_by') }}</span>
                            <select data-ds-control="hold_wearer" :value="holdView.wearer" @change="setHoldWearerFrom($event)">
                                <option v-for="choice in holdView.wearers" :key="choice.id" :value="choice.id">{{ choice.label }}</option>
                            </select>
                        </div>
                        <p v-else class="ds-view-note" data-ds-note="hold_first_person_view"><span class="ds-chip" data-ds-chip="hold_view_estimate">{{ t('display_sensei.hold.estimate') }}</span> {{ t('display_sensei.hold.first_person_view') }}<ds-tip :text="t('display_sensei.hold.first_person_view_tip')"></ds-tip></p>
                    </template>
                </div>

                <div v-if="!isHoldEditor && viewState.shown" class="ds-view" data-ds-view>
                    <div class="ds-view-head">
                        <button
                            type="button"
                            class="ds-view-toggle"
                            :class="{ open: viewOpen }"
                            data-ds-action="toggle_view"
                            :aria-expanded="viewOpen ? 'true' : 'false'"
                            :title="t('display_sensei.ui.view_toggle_hint')"
                            @click="toggleView"
                        ><i class="material-icons">expand_more</i><span>{{ t('display_sensei.ui.view') }}</span></button>
                        <span class="ds-chip" data-ds-chip="preview_only" :title="t('display_sensei.ui.preview_only_hint')">{{ t('display_sensei.ui.preview_only') }}</span>
                        <button
                            type="button"
                            class="ds-icon-button"
                            data-ds-action="reset_view"
                            :title="t('display_sensei.ui.reset_view_hint')"
                            @click="resetView"
                        ><i class="material-icons">center_focus_strong</i><span>{{ t('display_sensei.ui.reset_view') }}</span></button>
                    </div>
                    <template v-if="viewOpen">
                        <div v-if="activeSubtabId === 'third_back'" class="ds-flex-row">
                            <span class="ds-row-label">{{ t('display_sensei.ui.back_camera') }}</span>
                            <div class="ds-segment-group" role="group" :aria-label="t('display_sensei.ui.back_camera')">
                                <button
                                    v-for="option in ui.backCameraOptions"
                                    :key="option.id"
                                    type="button"
                                    class="ds-segment"
                                    :class="{ active: backCamera === option.id }"
                                    :title="t(option.hint)"
                                    :data-ds-back-camera="option.id"
                                    @click="setBackCamera(option.id)"
                                >{{ t(option.label) }}</button>
                            </div>
                        </div>
                        <div v-if="showReferenceRow()" class="ds-flex-row ds-view-reference" data-ds-control="reference_model">
                            <span class="ds-row-label">{{ t('display_sensei.ui.reference_model') }}</span>
                            <div class="ds-view-picker">
                                <div v-if="viewState.references" class="ds-icon-segments" role="group" :aria-label="t('display_sensei.ui.reference_model')">
                                    <button
                                        v-for="choice in viewState.references"
                                        :key="choice.id"
                                        type="button"
                                        class="ds-segment"
                                        :class="{ active: choice.active }"
                                        :title="getReferenceName(choice)"
                                        :aria-label="getReferenceName(choice)"
                                        :data-ds-reference="choice.id"
                                        @click="setReference(choice.id)"
                                        v-html="getIconHtml(choice.icon)"
                                    ></button>
                                </div>
                                <div class="ds-view-caption-row">
                                    <span class="ds-view-caption" data-ds-output="reference_name">{{ getActiveReferenceName() }}</span>
                                    <span
                                        v-if="viewState.reference && viewState.reference.approximate"
                                        class="ds-chip"
                                        data-ds-chip="reference_estimate"
                                        :title="t('display_sensei.ui.reference_estimate_hint')"
                                    >{{ t('display_sensei.ui.reference_estimate') }}</span>
                                    <ds-tip v-if="viewState.reference && viewState.reference.note" data-ds-output="reference_note" :text="viewState.reference.note"></ds-tip>
                                </div>
                            </div>
                        </div>
                        <template v-for="option in viewState.options">
                            <div
                                v-if="option.kind === 'select'"
                                :key="option.id"
                                class="ds-flex-row"
                                :data-ds-option-row="option.id"
                                :title="option.hint"
                            >
                                <span class="ds-row-label">{{ option.label }}</span>
                                <select :data-ds-option="option.id" :value="String(option.value)" @change="setReferenceOptionFrom(option, $event)">
                                    <option v-for="choice in option.choices" :key="choice.id" :value="String(choice.id)">{{ choice.label }}</option>
                                </select>
                            </div>
                            <label v-else :key="option.id" class="ds-check-row" :data-ds-option-row="option.id" :title="option.hint">
                                <input type="checkbox" :data-ds-option="option.id" :checked="option.value" @change="setReferenceOptionFrom(option, $event)">
                                <span>{{ option.label }}</span>
                            </label>
                        </template>
                        <div v-if="viewState.poseAngle" class="ds-flex-row" data-ds-control="pose_angle" :title="t('display_sensei.ui.pose_angle_hint')">
                            <span class="ds-row-label">{{ t('display_sensei.ui.pose_angle') }}</span>
                            <input
                                type="range"
                                data-ds-slider="pose_angle"
                                :min="viewState.poseAngle.min"
                                :max="viewState.poseAngle.max"
                                :step="ui.poseAngleStep"
                                :value="viewState.poseAngle.value"
                                @input="onPoseAngle($event)"
                            >
                            <span class="ds-view-value" data-ds-output="pose_angle">{{ formatPoseAngle() }}</span>
                        </div>
                        <label v-if="viewState.previewAnimation !== null" class="ds-check-row" :title="t('display_sensei.ui.preview_animation_hint')">
                            <input type="checkbox" data-ds-control="preview_animation" :checked="viewState.previewAnimation" @change="setPreviewAnimationFrom($event)">
                            <span>{{ t('display_sensei.ui.preview_animation') }}</span>
                        </label>
                        <div v-if="viewState.skin" class="ds-view-actions">
                            <button
                                type="button"
                                class="ds-icon-button"
                                data-ds-action="open_skin"
                                :title="t('display_sensei.ui.skin_hint')"
                                @click="openSkin"
                            ><i class="material-icons">person</i><span>{{ t('display_sensei.ui.skin') }}</span></button>
                        </div>
                    </template>
                </div>

                <div v-if="isViewShown && handViews" class="ds-hand-views" data-ds-hand-views>
                    <div class="ds-hand-views-head">
                        <button
                            type="button"
                            class="ds-view-toggle"
                            :class="{ open: handViewsOpen }"
                            data-ds-action="toggle_hand_views"
                            :aria-expanded="handViewsOpen ? 'true' : 'false'"
                            :title="t('display_sensei.ui.hand_views_hint')"
                            @click="toggleHandViews"
                        ><i class="material-icons">expand_more</i><span>{{ t('display_sensei.ui.hand_views') }}</span></button>
                        <span class="ds-chip" data-ds-chip="hand_views_preview_only" :title="t('display_sensei.ui.hand_views_preview_only_hint')">{{ t('display_sensei.ui.preview_only') }}</span>
                    </div>
                    <div v-if="handViewsOpen" class="ds-hand-view-grid">
                        <button
                            v-for="view in handViews"
                            :key="view.subtabId + '/' + view.handId"
                            type="button"
                            class="ds-hand-view"
                            :data-ds-hand-view="view.subtabId"
                            :title="tf('display_sensei.ui.hand_view_hint', { view: getSubtabLabel(view.subtabId) })"
                            @click="setSubtab(view.subtabId)"
                        >
                            <span class="ds-hand-view-picture" :class="{ 'ds-crosshair': view.subtabId === 'first_person' }">
                                <canvas ref="handViewCanvas" :data-ds-hand-view-canvas="view.subtabId" :width="ui.handViewSize[0]" :height="ui.handViewSize[1]"></canvas>
                            </span>
                            <span class="ds-hand-view-label">{{ getSubtabLabel(view.subtabId) }}</span>
                        </button>
                    </div>
                </div>

                <div v-if="otherHand" class="ds-match-row" data-ds-control="match_first_person">
                    <button
                        v-if="activeSubtabId === 'first_person'"
                        type="button"
                        class="ds-icon-button"
                        data-ds-action="match_first_person"
                        :title="t('display_sensei.ui.match_first_person_hint')"
                        @click="matchFirstPerson"
                    ><i class="material-icons">sync_alt</i><span>{{ t('display_sensei.ui.match_first_person') }}</span></button>
                    <button
                        v-else
                        type="button"
                        class="ds-icon-button"
                        data-ds-action="send_to_first_person"
                        :title="t('display_sensei.ui.send_to_first_person_hint')"
                        @click="matchFirstPerson"
                    ><i class="material-icons">sync_alt</i><span>{{ t('display_sensei.ui.send_to_first_person') }}</span></button>
                </div>

                <div v-if="isHoldEditor && showsOffHandChoice()" class="ds-check-group">
                    <label class="ds-check-row" :title="t('display_sensei.hold.same_as_main_hint')">
                        <input type="checkbox" data-ds-control="hold_same" :checked="slotState.inherited" :disabled="!slotState.hold.editing" @change="setInherited($event)">
                        <span>{{ t('display_sensei.hold.same_as_main') }}</span>
                    </label>
                </div>
                <div v-if="!isHoldEditor" class="ds-check-group">
                    <label class="ds-check-row" :title="t('display_sensei.ui.use_default_hint')">
                        <input type="checkbox" data-ds-control="inherit" :checked="slotState.inherited" @change="setInherited($event)">
                        <span>{{ t('display_sensei.ui.use_default') }}</span>
                    </label>
                    <label v-if="activeSlot.id === 'gui'" class="ds-check-row" :title="t('display_sensei.ui.fit_to_frame_hint')">
                        <input type="checkbox" data-ds-control="fit_to_frame" :checked="slotState.fitToFrame" @change="setFitToFrame($event)">
                        <span>{{ getTechnicalLabel('fit_to_frame', 'display_sensei.ui.fit_to_frame') }}</span>
                    </label>
                    <label
                        v-if="viewState.fitPreview"
                        class="ds-check-row ds-check-sub"
                        :data-ds-option-row="viewState.fitPreview.id"
                        :title="viewState.fitPreview.hint"
                    >
                        <input type="checkbox" :data-ds-option="viewState.fitPreview.id" :checked="viewState.fitPreview.value" @change="setReferenceOptionFrom(viewState.fitPreview, $event)">
                        <span>{{ viewState.fitPreview.label }}</span>
                    </label>
                </div>

                <div class="ds-grid-3 ds-channel-tabs">
                    <button
                        v-for="channel in ui.channelTabs"
                        :key="channel.id"
                        type="button"
                        class="ds-subtab"
                        :class="{ active: activeChannel === channel.id }"
                        :data-ds-channel-tab="channel.id"
                        @click="setChannel(channel.id)"
                    >{{ getChannelTabLabel(channel) }}</button>
                </div>

                <fieldset v-if="activeChannel === 'translation'" class="ds-channel" data-ds-section="translation" :disabled="!isChannelEditable('translation')">
                    <div class="ds-section-head">
                        <div class="ds-section-label">{{ isHoldEditor ? t('display_sensei.hold.position_label') : t('display_sensei.ui.translation_label') }}</div>
                        <button
                            type="button"
                            class="ds-reset-button"
                            data-ds-reset="translation"
                            :title="getResetChannelTitle('translation')"
                            @click="resetChannel('translation')"
                        ><i class="material-icons">replay</i><span>{{ t('display_sensei.ui.reset_channel') }}</span></button>
                    </div>
                    <ds-axis-inputs channel="translation" :values="slotState.values.translation" :step="moveStep" :limits="getInputLimits('translation')" @commit="commitAxis"></ds-axis-inputs>
                    <div class="ds-slider-row">
                        <div class="ds-axis-toggle ds-grid-3">
                            <button
                                v-for="(letter, axis) in ui.axisLetters"
                                :key="letter"
                                type="button"
                                class="ds-subtab"
                                :class="{ active: translationAxis === axis }"
                                :data-ds-translation-axis="axis"
                                :title="tf('display_sensei.ui.slider_axis', { axis: letter })"
                                @click="setTranslationAxis(axis)"
                            >{{ letter }}</button>
                        </div>
                        <input
                            type="range"
                            data-ds-slider="translation"
                            :min="getSliderRange('translation')[0]"
                            :max="getSliderRange('translation')[1]"
                            :step="moveStep"
                            :title="getTranslationSliderTitle()"
                            :style="{ '--color-thumb': 'var(--color-axis-' + ui.axisLetters[translationAxis].toLowerCase() + ')' }"
                            :value="slotState.values.translation[translationAxis]"
                            @mousedown="beginGesture($event)"
                            @touchstart="beginGesture($event)"
                            @input="onTranslationSlider($event)"
                            @change="releasePointer"
                        >
                    </div>
                    <div class="ds-flex-row ds-field">
                        <span class="ds-row-label">{{ t('display_sensei.ui.step') }}</span>
                        <select data-ds-control="move_step" :value="String(moveStep)" @change="setMoveStep($event)">
                            <option v-for="step in ui.moveSteps" :key="step" :value="String(step)">{{ tf('display_sensei.ui.step_px', { step: step }) }}</option>
                        </select>
                    </div>
                    <div class="ds-nudge-grid">
                        <button
                            v-for="nudge in ui.nudgeButtons"
                            :key="nudge.id"
                            type="button"
                            :data-ds-nudge="nudge.id"
                            :title="getNudgeTitle(nudge)"
                            @mousedown.prevent="startNudge(nudge, $event)"
                            @mouseup="releasePointer"
                            @mouseleave="releasePointer"
                            @touchstart.prevent="startNudge(nudge, $event)"
                            @touchend="releasePointer"
                            @touchcancel="releasePointer"
                            @click="nudgeFromKeyboard(nudge, $event)"
                        >{{ getNudgeLabel(nudge) }}</button>
                    </div>
                </fieldset>

                <fieldset v-else-if="activeChannel === 'rotation'" class="ds-channel" data-ds-section="rotation" :disabled="!isChannelEditable('rotation')">
                    <div class="ds-section-head">
                        <div class="ds-section-label">{{ t('display_sensei.ui.rotation_label') }}</div>
                        <button
                            type="button"
                            class="ds-reset-button"
                            data-ds-reset="rotation"
                            :title="getResetChannelTitle('rotation')"
                            @click="resetChannel('rotation')"
                        ><i class="material-icons">replay</i><span>{{ t('display_sensei.ui.reset_channel') }}</span></button>
                    </div>
                    <ds-axis-inputs channel="rotation" :values="slotState.values.rotation" :step="ui.inputSteps.rotation" :limits="getInputLimits('rotation')" @commit="commitAxis"></ds-axis-inputs>
                    <div v-if="slotState.gimbal" class="ds-card-note ds-gimbal-note" data-ds-note="gimbal">
                        <span>{{ getGimbalNote() }}<ds-tip :text="getGimbalTip()"></ds-tip></span>
                        <button
                            v-if="slotState.gimbal.tidy"
                            type="button"
                            data-ds-action="tidy_rotation"
                            :title="getTidyRotationTitle()"
                            @click="tidyRotation"
                        >{{ getTidyRotationLabel() }}</button>
                    </div>
                    <div class="ds-slider-row">
                        <div class="ds-axis-toggle ds-grid-3">
                            <button
                                v-for="(letter, axis) in ui.axisLetters"
                                :key="letter"
                                type="button"
                                class="ds-subtab"
                                :class="{ active: rotationAxis === axis }"
                                :data-ds-rotation-axis="axis"
                                :title="tf('display_sensei.ui.slider_axis', { axis: letter })"
                                @click="setRotationAxis(axis)"
                            >{{ letter }}</button>
                        </div>
                        <input
                            type="range"
                            data-ds-slider="rotation"
                            :min="ui.rotationSliderRange[0]"
                            :max="ui.rotationSliderRange[1]"
                            step="1"
                            :style="{ '--color-thumb': 'var(--color-axis-' + ui.axisLetters[rotationAxis].toLowerCase() + ')' }"
                            :value="getRotationSliderValue()"
                            @mousedown="beginGesture($event)"
                            @touchstart="beginGesture($event)"
                            @input="onRotationSlider($event)"
                            @change="releasePointer"
                        >
                    </div>
                    <div class="ds-grid-5 ds-quick-grid">
                        <button
                            v-for="value in ui.rotationQuickValues"
                            :key="value"
                            type="button"
                            :data-ds-rotation-quick="value"
                            :title="tf('display_sensei.ui.quick_rotation_hint', { axis: ui.axisLetters[rotationAxis], value: value })"
                            @click="setRotationQuickValue(value)"
                        >{{ value }}°</button>
                    </div>
                    <div class="ds-turn-row" data-ds-control="turn_180" :title="t('display_sensei.ui.turn_180_hint')">
                        <span class="ds-row-label">{{ t('display_sensei.ui.turn_180') }}</span>
                        <div class="ds-grid-3 ds-quick-grid">
                            <button
                                v-for="(letter, axis) in ui.axisLetters"
                                :key="letter"
                                type="button"
                                :data-ds-turn="axis"
                                :title="getTurnTitle(axis)"
                                @click="turnSlot(axis)"
                            >{{ letter }}</button>
                        </div>
                    </div>
                    <div class="ds-item-turn" data-ds-control="turn_item">
                        <span class="ds-row-label" :title="tf('display_sensei.ui.turn_item_hint', { amount: ui.itemTurnStep })">{{ tf('display_sensei.ui.turn_item', { amount: ui.itemTurnStep }) }}</span>
                        <div class="ds-nudge-grid">
                            <button
                                v-for="nudge in ui.nudgeButtons"
                                :key="nudge.id"
                                type="button"
                                :data-ds-turn-item="nudge.id"
                                :title="getItemTurnTitle(nudge)"
                                @click="turnItem(nudge)"
                            >{{ getNudgeLabel(nudge) }}</button>
                        </div>
                    </div>
                </fieldset>

                <fieldset v-else class="ds-channel" data-ds-section="scale" :disabled="!isChannelEditable('scale')">
                    <div class="ds-section-head">
                        <div class="ds-section-label">{{ t('display_sensei.ui.scale_label') }}</div>
                        <button
                            type="button"
                            class="ds-reset-button"
                            data-ds-reset="scale"
                            :title="getResetChannelTitle('scale')"
                            @click="resetChannel('scale')"
                        ><i class="material-icons">replay</i><span>{{ t('display_sensei.ui.reset_channel') }}</span></button>
                    </div>
                    <ds-axis-inputs channel="scale" :values="slotState.values.scale" :step="ui.inputSteps.scale" :limits="getInputLimits('scale')" @commit="commitAxis"></ds-axis-inputs>
                    <label class="ds-check-row" :title="t('display_sensei.ui.uniform_scale_hint')">
                        <input type="checkbox" data-ds-control="uniform_scale" :checked="scaleLocked" @change="setScaleLocked($event)">
                        <span>{{ t('display_sensei.ui.uniform_scale') }}</span>
                    </label>
                    <div class="ds-slider-row">
                        <div v-if="!scaleLocked" class="ds-axis-toggle ds-grid-3">
                            <button
                                v-for="(letter, axis) in ui.axisLetters"
                                :key="letter"
                                type="button"
                                class="ds-subtab"
                                :class="{ active: scaleAxis === axis }"
                                :data-ds-scale-axis="axis"
                                :title="tf('display_sensei.ui.slider_axis', { axis: letter })"
                                @click="setScaleAxis(axis)"
                            >{{ letter }}</button>
                        </div>
                        <input
                            type="range"
                            data-ds-slider="scale"
                            :min="ui.slotRanges.scale[0]"
                            :max="ui.slotRanges.scale[1]"
                            :step="ui.scaleSliderStep"
                            :title="getScaleSliderTitle()"
                            :style="scaleLocked ? null : { '--color-thumb': 'var(--color-axis-' + ui.axisLetters[scaleAxis].toLowerCase() + ')' }"
                            :value="slotState.values.scale[scaleLocked ? 0 : scaleAxis]"
                            @mousedown="beginGesture($event)"
                            @touchstart="beginGesture($event)"
                            @input="onScaleSlider($event)"
                            @change="releasePointer"
                        >
                    </div>
                    <div class="ds-grid-3 ds-quick-grid">
                        <button
                            v-for="value in ui.scaleQuickValues"
                            :key="value"
                            type="button"
                            :data-ds-scale-quick="value"
                            :title="getScaleQuickTitle(value)"
                            @click="setUniformScale(value)"
                        >{{ value }}×</button>
                    </div>
                </fieldset>

                <button
                    v-if="!isHoldEditor"
                    type="button"
                    class="ds-collapse"
                    :class="{ open: advancedOpen }"
                    data-ds-action="toggle_advanced"
                    :aria-expanded="advancedOpen ? 'true' : 'false'"
                    @click="toggleAdvanced"
                ><span>{{ t('display_sensei.ui.advanced') }}</span><i class="material-icons">expand_more</i></button>
                <div v-if="advancedOpen && !isHoldEditor" class="ds-channel" data-ds-section="advanced">
                    <template v-for="pivot in ui.pivotChannels">
                        <div :key="pivot.id + '-head'" class="ds-section-head">
                            <div class="ds-section-label"><span class="ds-pivot-key" :data-ds-pivot-key="pivot.id" :style="{ '--ds-pivot-key-color': ui.pivotMarkerColors[pivot.id] }" aria-hidden="true"></span>{{ getTechnicalLabel(pivot.id, pivot.label) }}</div>
                            <button
                                type="button"
                                class="ds-reset-button"
                                :data-ds-reset="pivot.id"
                                :title="getResetChannelTitle(pivot.id)"
                                @click="resetChannel(pivot.id)"
                            ><i class="material-icons">replay</i><span>{{ t('display_sensei.ui.reset_channel') }}</span></button>
                        </div>
                        <ds-axis-inputs :key="pivot.id" :channel="pivot.id" :values="slotState.values[pivot.id]" :step="ui.inputSteps[pivot.id]" @commit="commitAxis"></ds-axis-inputs>
                    </template>
                    <p class="ds-hint" data-ds-note="pivot_markers">{{ pivotMarkersShown ? t('display_sensei.info.pivot_marked') : t('display_sensei.info.pivot_units') }}<ds-tip :text="t('display_sensei.info.pivot_markers_tip')"></ds-tip></p>
                </div>

                <div v-if="otherHand && !isHoldEditor" class="ds-card-actions">
                    <button
                        type="button"
                        data-ds-action="mirror_slot"
                        :title="tf('display_sensei.ui.mirror_slot_hint', { hand: t(otherHand.label) })"
                        @click="mirrorSlot"
                    >{{ tf('display_sensei.ui.mirror_from', { hand: t(otherHand.label) }) }}</button>
                    <button
                        type="button"
                        data-ds-action="same_pose_slot"
                        :title="tf('display_sensei.ui.same_pose_slot_hint', { hand: t(otherHand.label) })"
                        @click="samePoseSlot"
                    >{{ tf('display_sensei.ui.same_pose_from', { hand: t(otherHand.label) }) }}</button>
                </div>
                <div v-else-if="otherHand && showsHoldHandCopy()" class="ds-card-actions">
                    <button
                        type="button"
                        data-ds-action="mirror_slot"
                        :disabled="!slotState.hold.editing"
                        :title="tf('display_sensei.hold.mirror_hint', { hand: t(otherHand.label) })"
                        @click="mirrorSlot"
                    >{{ tf('display_sensei.hold.mirror_from', { hand: t(otherHand.label) }) }}</button>
                    <button
                        type="button"
                        data-ds-action="same_pose_slot"
                        :disabled="!slotState.hold.editing"
                        :title="tf('display_sensei.hold.same_pose_hint', { hand: t(otherHand.label) })"
                        @click="samePoseSlot"
                    >{{ tf('display_sensei.ui.same_pose_from', { hand: t(otherHand.label) }) }}</button>
                </div>

                <div class="ds-section-head">
                    <div class="ds-section-label">{{ t('display_sensei.ui.preset') }}</div>
                    <span v-if="selectedPreset && selectedPreset.note" class="ds-preset-note" data-ds-output="preset_note">
                        <span v-if="selectedPreset.estimate" class="ds-chip" data-ds-chip="estimate">{{ t('display_sensei.ui.preset_estimate') }}</span>
                        <span v-if="selectedPreset.uncalibrated" class="ds-chip" data-ds-chip="uncalibrated">{{ t('display_sensei.ui.preset_uncalibrated') }}</span>
                        <span v-if="selectedPreset.calibrated" class="ds-chip custom" data-ds-chip="calibrated">{{ t('display_sensei.ui.preset_calibrated') }}</span>
                        <ds-tip :text="selectedPreset.note"></ds-tip>
                    </span>
                </div>
                <select class="ds-field" data-ds-control="preset" v-model="presetId" @mousedown="refreshPresetChoices" @focus="refreshPresetChoices">
                    <option value="" disabled>{{ t('display_sensei.ui.preset_choose') }}</option>
                    <optgroup v-for="group in presetGroups" :key="group.id" :label="t(group.label)" :data-ds-preset-group="group.id">
                        <option v-for="choice in group.choices" :key="choice.id" :value="choice.id">{{ choice.label }}</option>
                    </optgroup>
                </select>
                <div class="ds-preset-row">
                    <select data-ds-control="preset_scope" :value="presetScope" @change="setPresetScope($event)">
                        <option v-for="scope in presetScopeChoices" :key="scope.id" :value="scope.id">{{ t(scope.label) }}</option>
                    </select>
                    <button
                        type="button"
                        class="ds-primary"
                        data-ds-action="apply_preset"
                        :disabled="!presetId || (!!selectedPreset && selectedPreset.uncalibrated) || (isHoldEditor && !slotState.hold.editing)"
                        @click="applySelectedPreset"
                    >{{ t('display_sensei.ui.apply_preset') }}</button>
                </div>
                <div v-if="selectedCalibration" class="ds-calibration-actions" data-ds-control="calibration">
                    <button
                        type="button"
                        :data-ds-action="'calibrate_' + selectedCalibration.id"
                        :title="t(selectedCalibration.hint)"
                        @click="calibrateHold(selectedCalibration.id)"
                    >{{ t(selectedCalibration.label) }}</button>
                    <button
                        v-if="selectedPreset.calibrated"
                        type="button"
                        data-ds-action="forget_calibration"
                        :title="tf('display_sensei.ui.forget_calibration_hint', { hold: getCalibrationName(selectedPreset.calibration) })"
                        @click="forgetHold(selectedPreset.calibration)"
                    >{{ tf('display_sensei.ui.forget_calibration', { hold: getCalibrationName(selectedPreset.calibration) }) }}</button>
                </div>
                <div v-if="viewState.shown" class="ds-slot-actions">
                    <button type="button" data-ds-action="copy_slot" :title="t('display_sensei.ui.copy_slot_hint')" @click="copySlot">{{ t('display_sensei.ui.copy_slot') }}</button>
                    <button type="button" data-ds-action="paste_slot" :title="t('display_sensei.ui.paste_slot_hint')" @click="pasteSlot">{{ t('display_sensei.ui.paste_slot') }}</button>
                    <button type="button" data-ds-action="save_preset" :title="t('display_sensei.ui.save_preset_hint')" @click="savePreset">{{ t('display_sensei.ui.save_preset') }}</button>
                </div>
                <div v-if="isHoldEditor" class="ds-slot-actions ds-grid-2">
                    <button type="button" data-ds-action="copy_slot" :title="t('display_sensei.hold.copy_hint')" @click="copySlot">{{ t('display_sensei.ui.copy_slot') }}</button>
                    <button type="button" data-ds-action="paste_slot" :disabled="!slotState.hold.editing" :title="t('display_sensei.hold.paste_hint')" @click="pasteSlot">{{ t('display_sensei.ui.paste_slot') }}</button>
                </div>
                <p v-for="note in getLinkNotes(linkHandNotes)" :key="note.id" class="ds-card-note" :data-ds-note="'link_' + note.id">{{ note.text }}<ds-tip v-if="note.tip" :text="note.tip"></ds-tip></p>
            </div>

            <div v-else-if="cardKind === 'edit'" class="ds-transform-box" data-ds-card="edit" :data-ds-slot="activeSlot ? activeSlot.id : null">
                <h5>{{ getCardTitle() }}</h5>
                <div class="ds-card-key"><span class="ds-code">{{ cardTarget.key }}</span> {{ getCardTargetName() }}</div>
                <p class="ds-card-text">{{ t('display_sensei.hold.note_no_bone') }}<ds-tip :text="getEditCardTip()"></ds-tip></p>
                <p v-for="note in getLinkNotes(linkHandNotes)" :key="note.id" class="ds-card-note" :data-ds-note="'link_' + note.id">{{ note.text }}<ds-tip v-if="note.tip" :text="note.tip"></ds-tip></p>
            </div>

            <div
                v-if="infoCard"
                class="ds-info-card"
                :data-ds-card="cardKind"
                :data-ds-slot="activeSlot ? activeSlot.id : null"
                :data-ds-wear-slot="activeWearSlot ? activeWearSlot.id : null"
            >
                <h5 :title="activeWearSlot && cardKind !== 'mob' ? t(activeWearSlot.info) : null">{{ t(infoCard.title) }}</h5>
                <div v-if="activeWearSlot" class="ds-card-key" data-ds-wear-key><span class="ds-code" :title="t('display_sensei.armor.wearable_slot_name')">{{ activeWearSlot.wearableSlot }}</span></div>
                <p>{{ t(getInfoCardText()) }}<ds-tip :text="t(getInfoCardTip())"></ds-tip></p>
                <p v-for="note in getLinkNotes(cardKind === 'held_worn' ? linkHandNotes : linkArmorNotes)" :key="note.id" class="ds-card-note" :data-ds-note="'link_' + note.id">{{ note.text }}<ds-tip v-if="note.tip" :text="note.tip"></ds-tip></p>
                <div v-if="cardKind === 'held_worn' && holdWearSlot" class="ds-info-actions">
                    <button
                        type="button"
                        class="ds-icon-button"
                        data-ds-action="go_worn_armor"
                        :data-ds-go-slot="holdWearSlot"
                        :title="tf('display_sensei.hold.go_armor_hint', { slot: holdWearSlot })"
                        @click="openArmorSubtab(holdWearSlot)"
                    ><span>{{ tf('display_sensei.hold.go_armor', { tab: getWearSlotLabel(holdWearSlot) }) }}</span></button>
                </div>
                <div v-if="cardKind === 'offhand_pointer'" class="ds-info-actions">
                    <button
                        type="button"
                        class="ds-icon-button"
                        data-ds-action="go_left_hand"
                        :title="t('display_sensei.ui.go_left_hand_hint')"
                        @click="goToLeftHand"
                    ><span>{{ t('display_sensei.ui.go_left_hand') }}</span></button>
                </div>
                <div v-if="cardKind === 'worn_pointer'" class="ds-info-actions">
                    <button
                        type="button"
                        class="ds-icon-button"
                        data-ds-action="go_armor_head"
                        :title="t('display_sensei.ui.go_armor_head_hint')"
                        @click="openArmorSubtab('slot.armor.head')"
                    ><span>{{ t('display_sensei.ui.go_armor_head') }}</span></button>
                </div>
            </div>

            <div
                v-if="cardKind === 'armor' && armor && armor.slotId === activeSubtabId"
                class="ds-transform-box ds-armor-card"
                data-ds-card="armor"
                :data-ds-wear-slot="armor.slotId"
            >
                <h5 :title="t(activeSubtab.info)">{{ getCardTitle() }}</h5>
                <div class="ds-card-key" data-ds-wear-key><span class="ds-code" :title="t('display_sensei.armor.wearable_slot_name')">{{ activeWearSlot.wearableSlot }}</span></div>

                <template v-if="armorWornSlot">
                    <p
                        class="ds-card-text"
                        data-ds-note="armor_other_slot"
                        data-ds-armor-detected
                        :data-ds-wear-kind="wearInfo ? wearInfo.kind : 'unknown'"
                    >{{ tf('display_sensei.armor.other_slot', { tab: t(armorWornSlot.label) }) }}<ds-tip :text="getWornSlotTip()"></ds-tip></p>
                    <div class="ds-info-actions">
                        <button
                            type="button"
                            class="ds-icon-button"
                            data-ds-action="go_worn_slot"
                            :data-ds-go-slot="armorWornSlot.id"
                            :title="tf('display_sensei.armor.go_worn_slot_hint', { tab: t(armorWornSlot.label), slot: armorWornSlot.wearableSlot })"
                            @click="openArmorSubtab(armorWornSlot.id)"
                        ><span>{{ tf('display_sensei.armor.go_worn_slot', { tab: t(armorWornSlot.label) }) }}</span></button>
                    </div>
                </template>
                <p
                    v-else
                    class="ds-card-text"
                    data-ds-armor-detected
                    :data-ds-wear-kind="wearInfo ? wearInfo.kind : 'unknown'"
                >{{ getWearInfoText() }}<ds-tip :text="getWearInfoTip()"></ds-tip></p>
                <div class="ds-flex-row ds-armor-kind" :title="t('display_sensei.armor.kind_hint')">
                    <span class="ds-row-label">{{ t('display_sensei.armor.kind') }}</span>
                    <select data-ds-control="armor_kind" :value="getWearKindChoice()" @change="setWearKindFrom($event)">
                        <option v-for="choice in ui.wearKinds" :key="choice.id" :value="choice.id">{{ t(choice.label) }}</option>
                    </select>
                </div>

                <div class="ds-view ds-armor-view" data-ds-armor-view>
                    <div class="ds-view-head">
                        <span class="ds-section-label ds-armor-view-label">{{ t('display_sensei.armor.wearer_section') }}</span>
                        <span class="ds-chip" data-ds-chip="armor_preview_only" :title="t('display_sensei.armor.preview_only_hint')">{{ t('display_sensei.ui.preview_only') }}</span>
                    </div>
                    <div class="ds-flex-row" :title="t('display_sensei.armor.wearer_hint')">
                        <span class="ds-row-label">{{ t('display_sensei.armor.wearer') }}</span>
                        <select data-ds-control="armor_wearer" :value="armor.wearer" @change="setWearerFrom($event)">
                            <option v-for="choice in armor.wearers" :key="choice.id" :value="choice.id">{{ t(choice.label) }}</option>
                        </select>
                        <ds-tip v-if="isWearerShaded()" data-ds-note="armor_wearer_shaded" :text="t('display_sensei.armor.wearer_shaded')"></ds-tip>
                    </div>
                    <label v-for="toggle in ui.armorOverlayToggles" :key="toggle.id" class="ds-check-row" :title="t(toggle.hint)">
                        <input type="checkbox" :data-ds-control="'armor_overlay_' + toggle.id" :checked="armorOverlay[toggle.id]" @change="setOverlayToggle(toggle.id, $event)">
                        <span>{{ t(toggle.label) }}</span>
                    </label>
                    <div class="ds-flex-row" :title="t('display_sensei.armor.other_slots_hint')">
                        <span class="ds-row-label">{{ t('display_sensei.armor.other_slots') }}</span>
                        <select data-ds-control="armor_overlay_otherSlots" :value="armorOverlay.otherSlots" @change="setOtherSlotsFrom($event)">
                            <option v-for="choice in ui.armorOtherSlots" :key="choice.id" :value="choice.id">{{ t(choice.label) }}</option>
                        </select>
                    </div>
                    <div class="ds-flex-row" :title="t('display_sensei.armor.flat_texture_hint')">
                        <span class="ds-row-label">{{ t('display_sensei.armor.flat_texture') }}</span>
                        <select
                            data-ds-control="armor_overlay_flatTexture"
                            :value="armor.flatTexture || ''"
                            :disabled="armorOverlay.otherSlots !== 'flat'"
                            @change="setFlatTextureFrom($event)"
                        >
                            <option value="">{{ t('display_sensei.armor.flat_texture_none') }}</option>
                            <option v-for="texture in armor.textures" :key="texture.uuid" :value="texture.uuid">{{ texture.name }}</option>
                        </select>
                    </div>

                    <div class="ds-section-label ds-armor-view-label">{{ t('display_sensei.armor.camera') }}</div>
                    <div class="ds-grid-4">
                        <button
                            v-for="view in ui.armorCameraViews"
                            :key="view.id"
                            type="button"
                            class="ds-subtab"
                            :class="{ active: armor.camera === view.id }"
                            data-ds-action="armor_camera"
                            :data-ds-view="view.id"
                            :title="t(view.hint)"
                            @click="showArmorCamera(view.id)"
                        >{{ t(view.label) }}</button>
                    </div>
                    <button
                        type="button"
                        class="ds-icon-button ds-armor-wide-button"
                        data-ds-action="armor_camera_restore"
                        :title="t('display_sensei.armor.camera_restore_hint')"
                        @click="restoreCamera"
                    ><i class="material-icons">center_focus_strong</i><span>{{ t('display_sensei.armor.camera_restore') }}</span></button>

                    <div class="ds-section-label ds-armor-view-label">{{ t('display_sensei.armor.pose_test') }}<ds-tip v-if="getChosenPoseNote()" data-ds-note="armor_chosen_poses" :text="getChosenPoseNote()"></ds-tip></div>
                    <div v-if="armor.poses.length" class="ds-armor-poses">
                        <button
                            v-for="pose in armor.poses"
                            :key="pose.id"
                            type="button"
                            class="ds-subtab"
                            :class="{ active: armor.activePose === pose.id }"
                            data-ds-action="armor_pose"
                            :data-ds-pose="pose.id"
                            :aria-pressed="armor.activePose === pose.id ? 'true' : 'false'"
                            :title="t('display_sensei.armor.pose_hint')"
                            @click="togglePose(pose.id)"
                        >{{ t(pose.label) }}</button>
                    </div>
                    <p v-else class="ds-view-note" data-ds-note="armor_no_poses">{{ t('display_sensei.armor.no_poses') }}</p>
                </div>

                <template v-if="!armorWornSlot">
                    <div class="ds-armor-section" data-ds-armor-checks>
                        <div class="ds-section-label">{{ tf('display_sensei.armor.checks_label', { wearer: getWearerName() }) }}</div>
                        <div v-if="!armor.checks.length" class="ds-empty-note" data-ds-armor-checks-empty>{{ t('display_sensei.armor.checks_empty') }}</div>
                        <div
                            v-for="(check, index) in armor.checks"
                            :key="index + '|' + check.id"
                            class="ds-armor-check"
                            :class="'ds-severity-' + check.severity"
                            :data-ds-armor-check="check.id"
                            :data-ds-severity="check.severity"
                        >
                            <div class="ds-armor-check-head">
                                <span class="ds-chip" :class="'ds-chip-' + check.severity" data-ds-chip="severity">{{ getSeverityLabel(check.severity) }}</span>
                                <span v-if="check.approximate" class="ds-chip" data-ds-chip="armor_estimate" :title="t('display_sensei.armor.estimate_hint')">{{ t('display_sensei.armor.estimate') }}</span>
                            </div>
                            <p class="ds-armor-check-text">{{ tf(check.textKey, check.values) }}<ds-tip v-if="getCheckTip(check)" :text="getCheckTip(check)"></ds-tip></p>
                            <div v-if="check.fixes && check.fixes.length" class="ds-armor-fixes">
                                <button
                                    v-for="fixId in check.fixes"
                                    :key="fixId"
                                    type="button"
                                    data-ds-action="armor_fix"
                                    :data-ds-fix="fixId"
                                    :title="getFixHint(fixId)"
                                    @click="applyFix(check, fixId)"
                                >{{ getFixLabel(fixId) }}</button>
                            </div>
                        </div>
                    </div>

                    <div class="ds-armor-section ds-armor-fit" data-ds-armor-fit>
                        <div class="ds-section-label">{{ t('display_sensei.armor.fit_label') }}<ds-tip :text="t('display_sensei.armor.fit_intro')"></ds-tip></div>
                        <label class="ds-check-row" :title="t('display_sensei.armor.fit_preview_hint')">
                            <input type="checkbox" data-ds-control="armor_fit_preview" :checked="armor.fitPreview" @change="setFitPreviewFrom($event)">
                            <span>{{ t('display_sensei.armor.fit_preview') }}</span>
                        </label>
                        <div v-if="!armor.fitRows.length" class="ds-empty-note" data-ds-armor-fit-empty>{{ tf('display_sensei.armor.fit_empty', { bones: activeWearSlot.bones.join(', ') }) }}</div>
                        <template v-else>
                            <div class="ds-grid-3 ds-channel-tabs">
                                <button
                                    v-for="channel in ui.fitChannels"
                                    :key="channel.id"
                                    type="button"
                                    class="ds-subtab"
                                    :class="{ active: armorFitChannel === channel.id }"
                                    :data-ds-armor-fit-channel="channel.id"
                                    @click="setArmorFitChannel(channel.id)"
                                >{{ t(channel.label) }}</button>
                            </div>
                            <div v-for="row in armor.fitRows" :key="row.name" class="ds-armor-fit-bone" :data-ds-armor-fit-bone="row.name">
                                <div class="ds-armor-fit-name"><span class="ds-code">{{ row.name }}</span> {{ getFitTargetName(row) }}</div>
                                <ds-axis-inputs
                                    :channel="armorFitChannel"
                                    :values="row.values[armorFitChannel]"
                                    :step="ui.fitSteps[armorFitChannel]"
                                    :limits="ui.fitRanges[armorFitChannel]"
                                    @commit="commitFitOffset(row.name, arguments[0], arguments[1], arguments[2])"
                                ></ds-axis-inputs>
                            </div>
                        </template>
                        <div class="ds-armor-fit-actions">
                            <button
                                type="button"
                                data-ds-action="armor_fit_reset"
                                :disabled="!armor.hasFitOffsets"
                                :title="t('display_sensei.armor.fit_reset_hint')"
                                @click="resetFit"
                            >{{ t('display_sensei.armor.fit_reset') }}</button>
                            <button
                                type="button"
                                class="ds-primary"
                                data-ds-action="armor_bake"
                                :disabled="!armor.hasFitOffsets"
                                :title="t('display_sensei.armor.bake_hint')"
                                @click="bakeFit"
                            >{{ t('display_sensei.armor.bake') }}</button>
                        </div>
                    </div>

                    <p v-for="note in getLinkNotes(linkArmorNotes)" :key="note.id" class="ds-card-note" :data-ds-note="'link_' + note.id">{{ note.text }}<ds-tip v-if="note.tip" :text="note.tip"></ds-tip></p>

                    <button
                        type="button"
                        class="ds-collapse ds-armor-facts-toggle"
                        :class="{ open: armorFactsOpen }"
                        data-ds-action="toggle_armor_facts"
                        :aria-expanded="armorFactsOpen ? 'true' : 'false'"
                        @click="toggleArmorFacts"
                    ><span>{{ t('display_sensei.armor.facts') }}</span><i class="material-icons">expand_more</i></button>
                    <div v-if="armorFactsOpen" class="ds-armor-facts" data-ds-armor-facts>
                        <p v-for="fact in ui.armorFacts" :key="fact.id" class="ds-armor-fact" :data-ds-armor-fact="fact.id">{{ t(fact.text) }}<ds-tip v-if="fact.tip" :text="t(fact.tip)"></ds-tip></p>
                        <p v-for="entry in ui.armorVersionFacts" :key="entry.version" class="ds-armor-fact" :data-ds-armor-version="entry.version">
                            <span class="ds-chip">{{ entry.version }}</span> {{ t(entry.text) }}<ds-tip v-if="entry.tip" :text="t(entry.tip)"></ds-tip>
                        </p>
                    </div>
                </template>
            </div>

            <div
                v-if="activeTab === 'output'"
                class="ds-info-card ds-link-card"
                data-ds-card="pack_link"
                :data-ds-link-status="link ? link.status : 'pending'"
            >
                <h5>{{ t('display_sensei.link.title') }}<ds-tip :text="t('display_sensei.link.intro')"></ds-tip></h5>
                <div v-if="!link" class="ds-empty-note" data-ds-link-empty="pending">{{ t('display_sensei.link.pending') }}</div>
                <div v-else-if="link.status !== 'linked'" class="ds-empty-note" :data-ds-link-empty="link.status">{{ getLinkEmptyText() }}<ds-tip v-if="getLinkEmptyTip()" :text="getLinkEmptyTip()"></ds-tip></div>
                <template v-else>
                    <div class="ds-link-packs">
                        <p class="ds-link-line" data-ds-link="rp" :title="link.rp.path">{{ tf('display_sensei.link.rp', { name: link.rp.name }) }}</p>
                        <p class="ds-link-line" data-ds-link="bp" :data-ds-bp-status="link.bp.status" :title="link.bp.path || null">{{ getBehaviorPackText() }}<ds-tip v-if="link.bp.status === 'ambiguous'" :text="t('display_sensei.link.bp_ambiguous_tip')"></ds-tip></p>
                        <p class="ds-link-line" data-ds-link="stamps">{{ getStampText() }}<ds-tip v-if="link.stamps.length" data-ds-link="stamps_hint" :text="t('display_sensei.link.stamps_hint')"></ds-tip></p>
                    </div>
                    <p v-for="note in getLinkNotes(link.notes)" :key="note.id" class="ds-card-note" :data-ds-note="'link_' + note.id">{{ note.text }}<ds-tip v-if="note.tip" :text="note.tip"></ds-tip></p>
                    <div v-for="group in getLinkFileGroups()" :key="group.id" class="ds-link-files" :data-ds-link-group="group.id">
                        <div class="ds-section-label">{{ t(group.label) }}</div>
                        <div
                            v-for="(row, index) in group.rows"
                            :key="index + '|' + row.path + '|' + (row.id || '')"
                            class="ds-link-file"
                            :class="{ 'ds-link-absent': row.exists !== true }"
                            :data-ds-link-file="row.path"
                            :data-ds-pack="row.pack"
                            :data-ds-kind="row.kind"
                            :data-ds-exists="String(row.exists)"
                            :data-ds-maybe-game="String(row.maybe_game)"
                            :data-ds-rewritten="String(row.rewritten)"
                            :data-ds-role="row.role"
                        >
                            <div class="ds-link-file-head">
                                <span class="ds-chip" data-ds-chip="file_kind" :title="getLinkKindHint(row)">{{ getLinkKindLabel(row) }}</span>
                                <span class="ds-code"><template v-for="(part, partIndex) in getPathParts(row.path)"><wbr v-if="partIndex > 0">{{ part }}</template></span>
                            </div>
                            <div class="ds-link-file-detail">
                                <p class="ds-hint">{{ getLinkFileDetail(row) }}</p>
                                <span v-if="row.exists === false" class="ds-chip" data-ds-chip="not_found">{{ t('display_sensei.link.not_found') }}</span>
                                <span v-if="row.rewritten" class="ds-chip custom" data-ds-chip="rewritten" :title="getRewrittenHint()">{{ t('display_sensei.link.rewritten') }}</span>
                            </div>
                        </div>
                    </div>
                </template>
                <div v-if="showLinkActions()" class="ds-link-actions">
                    <button type="button" data-ds-action="link_refresh" :title="t('display_sensei.link.refresh_hint')" @click="refreshLink">{{ t('display_sensei.link.refresh') }}</button>
                    <button v-if="link && link.status === 'linked'" type="button" data-ds-action="link_open_folder" :title="t('display_sensei.link.open_rp_hint')" @click="openLinkedFolder('rp')">{{ t('display_sensei.link.open_rp') }}</button>
                    <button v-if="link && link.status === 'linked' && link.bp.status === 'found'" type="button" data-ds-action="link_open_bp_folder" :title="t('display_sensei.link.open_bp_hint')" @click="openLinkedFolder('bp')">{{ t('display_sensei.link.open_bp') }}</button>
                </div>
            </div>

            <div v-if="activeTab === 'output' && output" class="ds-section" data-ds-card="output">
                <div class="ds-section-label">{{ getTechnicalLabel('format_version', 'display_sensei.ui.geometry_version') }}<ds-tip v-if="getSelectedVersionHint()" :text="getSelectedVersionHint()"></ds-tip></div>
                <select data-ds-control="geometry_version" :value="output.selected" @change="setVersion($event)">
                    <option v-for="choice in output.choices" :key="choice.version" :value="choice.version" :title="choice.hint">{{ choice.label }}</option>
                </select>
                <p v-if="output.text" class="ds-output-version" data-ds-output="effective_version">{{ tf('display_sensei.ui.effective_version', { version: output.effective }) }}</p>
                <p v-if="output.raised" class="ds-card-note" data-ds-note="version_raised">{{ tf('display_sensei.ui.version_raised', { selected: output.selected, version: output.effective }) }}</p>

                <div class="ds-section-label ds-output-label">{{ t(currentRoute.output) }}<ds-tip v-if="output.text" :text="t('display_sensei.ui.output_block_hint')"></ds-tip></div>
                <textarea v-if="output.text" class="ds-output-code" data-ds-output="json" rows="12" readonly spellcheck="false" :value="output.text"></textarea>
                <div v-else class="ds-empty-note" data-ds-output="empty">{{ t('display_sensei.ui.output_empty') }}<ds-tip :text="t('display_sensei.ui.output_empty_tip')"></ds-tip></div>
                <div class="ds-grid-2 ds-output-actions">
                    <button type="button" class="ds-primary" data-ds-action="copy_output" :disabled="!output.text" @click="copyOutput">{{ t('display_sensei.ui.copy') }}</button>
                    <button type="button" data-ds-action="export_output" :title="t('display_sensei.ui.export_geometry_hint')" @click="exportGeometry">{{ t('display_sensei.ui.export_geometry') }}</button>
                </div>
            </div>

            <div v-else-if="activeTab === 'output' && route === 'entity'" class="ds-section" data-ds-card="output">
                <div class="ds-section-label">{{ t(currentRoute.output) }}</div>
                <p class="ds-hint">{{ t('display_sensei.info.output_entity') }}</p>
            </div>

            <div
                v-else-if="activeTab === 'output'"
                class="ds-section ds-hold-write"
                data-ds-card="output"
                data-ds-hold-write
                :data-ds-hold-pending="holdWrite ? String(holdWrite.pending) : null"
            >
                <div class="ds-section-label">{{ t('display_sensei.hold_write.title') }}<ds-tip :text="t('display_sensei.hold_write.title_tip')"></ds-tip></div>
                <p v-if="holdWrite && holdWrite.desktopOnly" class="ds-empty-note" data-ds-note="hold_desktop_only">{{ t('display_sensei.message.hold_desktop_only') }}</p>
                <template v-else-if="holdWrite">
                    <p
                        v-for="file in holdWrite.files"
                        :key="file.path"
                        class="ds-hint ds-hold-file"
                        :data-ds-hold-file="file.path"
                        :data-ds-hold-file-state="getHoldFileState(file)"
                        :title="file.path"
                    ><span class="ds-code">{{ file.name }}</span> {{ getHoldFileStateText(file) }}</p>
                    <p v-if="holdWrite.target" class="ds-card-note" data-ds-note="hold_target" :title="holdWrite.target">{{ tf('display_sensei.hold_write.target', { file: getFileName(holdWrite.target) }) }}<ds-tip :text="t('display_sensei.hold_write.target_tip')"></ds-tip></p>
                    <button
                        v-if="holdWrite.target"
                        type="button"
                        class="ds-wide-button"
                        data-ds-action="hold_clear_target"
                        :title="t('display_sensei.hold_write.clear_target_hint')"
                        @click="clearTarget"
                    >{{ t('display_sensei.hold_write.clear_target') }}</button>
                    <p v-if="holdFileChanged()" class="ds-card-note" data-ds-note="hold_file_changed">{{ t('display_sensei.hold_write.changed') }}<ds-tip :text="t('display_sensei.hold_write.changed_tip')"></ds-tip></p>
                    <p v-if="!holdWrite.files.length" class="ds-empty-note" data-ds-note="hold_no_file">{{ t('display_sensei.hold_write.no_file') }}<ds-tip :text="t('display_sensei.hold_write.no_file_tip')"></ds-tip></p>
                    <p v-if="holdWrite.skipped.length" class="ds-card-note" data-ds-note="hold_skipped">{{ t('display_sensei.hold_write.skipped') }}<ds-tip :text="t('display_sensei.hold_write.skipped_tip')"></ds-tip></p>
                    <div class="ds-grid-2 ds-output-actions">
                        <button
                            type="button"
                            class="ds-primary"
                            data-ds-action="hold_write"
                            :disabled="!canWriteHolds()"
                            :title="t('display_sensei.hold_write.write_hint')"
                            @click="writeHolds"
                        >{{ t('display_sensei.hold_write.write') }}</button>
                        <button
                            type="button"
                            data-ds-action="hold_restore"
                            :disabled="!getHoldBackupFile() || holdBusy"
                            :title="t('display_sensei.hold_write.restore_hint')"
                            @click="restoreHolds"
                        >{{ t('display_sensei.hold_write.restore') }}</button>
                    </div>
                </template>
                <div class="ds-section-label ds-output-label">{{ t('display_sensei.hold_write.json_label') }}<ds-tip :text="t('display_sensei.hold_write.json_tip')"></ds-tip></div>
                <textarea v-if="holdJson" class="ds-output-code" data-ds-output="hold_json" rows="10" readonly spellcheck="false" :value="holdJson"></textarea>
                <div v-else class="ds-empty-note" data-ds-output="hold_empty">{{ t('display_sensei.hold_write.empty') }}</div>
                <div class="ds-grid-2 ds-output-actions">
                    <button type="button" class="ds-primary" data-ds-action="copy_output" :disabled="!holdJson" @click="copyHoldJson">{{ t('display_sensei.ui.copy') }}</button>
                    <button type="button" data-ds-action="export_output" :disabled="!holdJson" :title="t('display_sensei.hold_write.export_hint')" @click="exportHoldJson">{{ t('display_sensei.ui.export') }}</button>
                </div>
                <button
                    v-if="holdAttachableLines"
                    type="button"
                    class="ds-wide-button"
                    data-ds-action="hold_copy_attachable"
                    :title="t('display_sensei.hold_write.attachable_lines_hint')"
                    @click="copyAttachableLines"
                >{{ t('display_sensei.hold_write.attachable_lines') }}</button>
            </div>
        </template>
    </div>

    <div class="ds-footer">
        <div v-if="!isMobile" class="ds-grid-2">
            <button v-if="panelMode !== 'floating'" type="button" data-ds-action="float_panel" @click="movePanelToFloat">{{ t('display_sensei.ui.float_panel') }}</button>
            <button v-if="panelMode !== 'docked'" type="button" data-ds-action="dock_panel" @click="movePanelToDock">{{ t('display_sensei.ui.dock_panel') }}</button>
            <button v-if="panelMode !== 'tabbed'" type="button" data-ds-action="tab_panel" @click="movePanelToTab">{{ t('display_sensei.ui.tab_panel') }}</button>
        </div>
        <button type="button" data-ds-action="close_panel" @click="closePanel">{{ t('display_sensei.ui.close_panel') }}</button>
    </div>
</div>
`;

// =========================
// Panel component
// =========================
function buildPanelComponent() {
    let savedState = loadUiState();
    setBackCameraStyle(savedState.backCamera);
    setWearer(savedState.armorWearer);
    setOverlayOptions({
        show: false,
        outerLayer: savedState.armorOverlay.outerLayer,
        otherSlots: savedState.armorOverlay.otherSlots,
        xray: savedState.armorOverlay.xray
    });
    return {
        name: 'display-sensei-panel',
        template: PANEL_TEMPLATE,
        components: {
            'ds-axis-inputs': buildAxisInputsComponent(),
            'ds-tip': buildTipComponent()
        },
        data() {
            return {
                activeTab: savedState.tab,
                activeSubtabs: savedState.subtabs,
                hand: savedState.hand,
                route: getRoute(),
                formatId: getFormatId(),
                panelMode: 'docked',
                isMobile: Blockbench.isMobile,
                slotState: null,
                viewState: {
                    shown: false, references: null, reference: null, poseAngle: null, previewAnimation: null,
                    options: [], fitPreview: null, skin: false
                },
                output: null,
                link: null,
                linkHandNotes: [],
                linkArmorNotes: [],
                wearInfo: null,
                armor: null,
                armorWearer: getWearer(),
                armorOverlay: savedState.armorOverlay,
                armorFitChannel: savedState.armorFitChannel,
                armorFactsOpen: savedState.armorFactsOpen,
                entityKeepsTransforms: false,
                presetChoices: [],
                presetId: '',
                presetScope: savedState.presetScope,
                backCamera: savedState.backCamera,
                activeChannel: savedState.channel,
                moveStep: savedState.moveStep,
                translationAxis: savedState.translationAxis,
                rotationAxis: savedState.rotationAxis,
                scaleAxis: savedState.scaleAxis,
                scaleLocked: savedState.scaleLocked,
                advancedOpen: savedState.advancedOpen,
                pivotMarkersShown: false,
                viewOpen: savedState.viewOpen,
                handViews: null,
                handViewsOpen: savedState.handViewsOpen,
                holdWearSlot: null,
                holdOverview: null,
                holdView: getHeldPreviewState(),
                holdWrite: null,
                holdJson: '',
                holdAttachableLines: '',
                holdPresetChoices: [],
                holdBusy: false
            };
        },
        created() {
            this.gesture = null;
            this.nudgeDelayTimer = null;
            this.nudgeRepeatTimer = null;
            this.followedContextKey = '';
            this.showingOwnContext = false;
            this.handViewsKey = '';
            this.handViewTimer = null;
            this.armorCardShown = false;
            this.overlayProjectKey = '';
            this.onWindowPointerUp = () => this.releasePointer();
            this.onWindowKeyDown = event => {
                if (event.key === 'Escape' && this.cancelGesture()) {
                    event.preventDefault();
                    event.stopPropagation();
                }
            };
            this.syncCard();
        },
        beforeDestroy() {
            this.releasePointer();
            clearTimeout(this.handViewTimer);
            this.handViewTimer = null;
            this.endArmorPreview();
            hideHoldView();
            setPivotMarkersShown(false);
        },
        watch: {
            cardSlotId() {
                this.syncSlotState();
                this.syncPivotMarkers();
            },
            holdSlotId() {
                this.syncSlotState();
                this.syncHoldView();
            }
        },
        computed: {
            ui() {
                return PANEL_CONSTANTS;
            },
            currentRoute() {
                return ROUTES.find(entry => entry.id === this.route) || null;
            },
            currentSubtabs() {
                let tab = findMainTab(this.activeTab);
                return tab ? tab.subtabs : [];
            },
            activeSubtabId() {
                return this.activeSubtabs[this.activeTab] || '';
            },
            activeSubtab() {
                return this.currentSubtabs.find(subtab => subtab.id === this.activeSubtabId) || null;
            },
            activeHand() {
                return findHand(this.hand);
            },
            activeSlot() {
                return findSlotForContext(this.activeSubtabId, this.hand);
            },
            activeWearSlot() {
                return findWearSlot(this.activeSubtabId) || null;
            },
            cardKind() {
                if (this.activeWearSlot) return this.activeWearSlot.support[this.route] || '';
                if (!this.activeSlot) return '';
                let kind = this.activeSlot.support[this.route] || '';
                if (kind === 'edit' && this.route === 'attachable' && this.holdWearSlot) return 'held_worn';
                return kind;
            },
            infoCard() {
                return INFO_CARDS[this.cardKind] || null;
            },
            cardNote() {
                if (this.activeSubtabId === 'third_front') return SHARED_THIRD_PERSON_NOTE;
                return (this.activeSlot && BEDROCK_DIFFERENCE_NOTES[this.activeSlot.id]) || null;
            },
            armorWornSlot() {
                let wear = this.wearInfo;
                let slot = wear && wear.slot ? findWearSlot(wear.slot) : null;
                return slot && this.armor && slot.id !== this.armor.slotId ? slot : null;
            },
            cardTarget() {
                let slot = this.activeSlot;
                if (!slot) {
                    let wear = this.activeWearSlot;
                    return wear ? { key: wear.wearableSlot, label: wear.label } : null;
                }
                if (this.route === 'attachable') {
                    return { key: slot.attachableKey, label: slot.attachableLabel };
                }
                return { key: slot.bedrockKey, label: slot.label };
            },
            cardSlotId() {
                if (this.route !== 'block' || this.cardKind !== 'edit' || !this.activeSlot) return '';
                return this.activeSlot.id;
            },
            armorSlotId() {
                return this.cardKind === 'armor' ? this.activeSubtabId : '';
            },
            showBlockEditor() {
                return !!this.cardSlotId && !!this.slotState && this.slotState.id === this.cardSlotId;
            },
            holdSlotId() {
                if (this.route !== 'attachable' || this.cardKind !== 'edit' || !this.activeSlot || !findHoldSlot(this.activeSlot.id)) return '';
                return this.activeSlot.id;
            },
            showHoldEditor() {
                return !!this.holdSlotId && !!this.slotState && this.slotState.id === this.holdSlotId && !!this.slotState.hold;
            },
            isHoldEditor() {
                return this.showHoldEditor;
            },
            showEditor() {
                return this.showBlockEditor || this.showHoldEditor;
            },
            isViewShown() {
                return this.isHoldEditor ? this.holdView.shown : this.viewState.shown;
            },
            holdChecks() {
                return this.isHoldEditor && this.holdOverview ? this.holdOverview.checks : [];
            },
            currentPresetChoices() {
                return this.route === 'attachable' ? this.holdPresetChoices : this.presetChoices;
            },
            presetScopeChoices() {
                return this.route === 'attachable' ? HOLD_PRESET_SCOPES : PRESET_SCOPES;
            },
            otherHand() {
                let slot = this.activeSlot;
                if (!slot || !slot.hand) return null;
                return HANDS.find(hand => hand.id !== slot.hand) || null;
            },
            presetGroups() {
                if (this.route === 'attachable') {
                    return HOLD_PRESET_GROUPS
                        .map(group => ({ id: group.id, label: group.label, choices: this.holdPresetChoices.filter(choice => choice.group === group.id) }))
                        .filter(group => group.choices.length);
                }
                let groups = PRESET_GROUPS.map(group => ({
                    id: group.id,
                    label: group.label,
                    choices: this.presetChoices.filter(choice => !choice.saved && choice.group === group.id)
                }));
                groups.push(Object.assign({}, SAVED_PRESET_GROUP, { choices: this.presetChoices.filter(choice => choice.saved) }));
                return groups.filter(group => group.choices.length);
            },
            selectedPreset() {
                return this.currentPresetChoices.find(choice => choice.id === this.presetId) || null;
            },
            selectedCalibration() {
                let preset = this.selectedPreset;
                return (preset && CALIBRATION_ACTIONS.find(action => action.id === preset.calibration)) || null;
            }
        },
        methods: {
            t(key) {
                return i18n(key);
            },
            tf(key, values) {
                return i18nFormat(key, values);
            },
            getTechnicalLabel(key, labelKey) {
                return this.tf('display_sensei.ui.technical_label', { key, label: this.t(labelKey) });
            },
            getCardTitle() {
                let contextLabel = this.t(this.activeSubtab.label);
                if (this.activeTab !== 'hand') {
                    return contextLabel;
                }
                return this.tf('display_sensei.ui.card_title_hand', {
                    context: contextLabel,
                    hand: this.t(this.activeHand.label)
                });
            },
            getCardTargetName() {
                let name = this.t(this.cardTarget.label);
                if (name.toLowerCase() === this.cardTarget.key.toLowerCase()) {
                    return '';
                }
                return this.tf('display_sensei.ui.card_target_name', { name });
            },
            getNudgeLabel(nudge) {
                return `${AXIS_LETTERS[nudge.axis]} ${nudge.sign < 0 ? '−' : '+'}`;
            },
            getNudgeTitle(nudge) {
                return this.tf('display_sensei.ui.nudge_hint', {
                    axis: AXIS_LETTERS[nudge.axis],
                    amount: (nudge.sign < 0 ? '−' : '+') + this.moveStep
                });
            },
            getRotationSliderValue() {
                return wrapAngle(this.slotState.values.rotation[this.rotationAxis]);
            },
            getScaleQuickTitle(value) {
                let contexts = this.isHoldEditor ? [] : findContextsWithDefaultScale(value);
                let title = this.tf('display_sensei.ui.scale_quick_hint', { value: value });
                if (contexts.length) {
                    title += '\n' + this.tf('display_sensei.ui.scale_default_for', { contexts: contexts.join(', ') });
                }
                return title;
            },
            getTurnTitle(axis) {
                let others = AXIS_LETTERS.filter((letter, index) => index !== axis).join('+');
                return this.tf('display_sensei.ui.turn_axis_hint', { axis: AXIS_LETTERS[axis], axes: others });
            },
            getItemTurnTitle(nudge) {
                return this.tf('display_sensei.ui.turn_item_axis_hint', {
                    axis: AXIS_LETTERS[nudge.axis],
                    amount: (nudge.sign < 0 ? '−' : '+') + ITEM_TURN_STEP
                });
            },
            getGimbalNote() {
                let gimbal = this.slotState.gimbal;
                let key = gimbal.change > 0 ? 'display_sensei.info.gimbal_near' : 'display_sensei.info.gimbal_lock';
                return this.tf(key, { y: formatEditorValue(gimbal.y) });
            },
            getGimbalTip() {
                let gimbal = this.slotState.gimbal;
                let key = gimbal.change > 0 ? 'display_sensei.info.gimbal_near_tip' : 'display_sensei.info.gimbal_lock_tip';
                return this.tf(key, { y: formatEditorValue(gimbal.y) });
            },
            getTidyRotationLabel() {
                return this.tf('display_sensei.ui.tidy_rotation', { values: this.slotState.gimbal.tidy.map(formatEditorValue).join(', ') });
            },
            getTidyRotationTitle() {
                let gimbal = this.slotState.gimbal;
                return this.tf('display_sensei.ui.tidy_rotation_hint', {
                    values: gimbal.tidy.map(formatEditorValue).join(', '),
                    change: formatEditorValue(gimbal.change)
                });
            },
            getSelectedVersionHint() {
                let choice = this.output.choices.find(entry => entry.version === this.output.selected);
                return choice ? choice.hint : '';
            },
            getResetChannelTitle(channel) {
                if (this.isHoldEditor) {
                    let holdValues = getHoldChannelDefault(this.slotState.id, HOLD_EDITOR_CHANNELS[channel]);
                    return this.tf('display_sensei.hold.reset_channel_hint', {
                        channel: this.getChannelName(channel),
                        values: holdValues ? holdValues.map(formatEditorValue).join(', ') : ''
                    });
                }
                let values = this.slotState ? getChannelDefault(this.slotState.id, channel) : null;
                return this.tf('display_sensei.ui.reset_channel_hint', {
                    channel: this.t(CHANNEL_LABELS[channel]),
                    values: values ? values.map(formatEditorValue).join(', ') : ''
                });
            },
            getChannelName(channel) {
                return this.isHoldEditor && channel === 'translation' ? this.t('display_sensei.hold.position') : this.t(CHANNEL_LABELS[channel]);
            },
            getChannelTabLabel(channel) {
                return this.getChannelName(channel.id);
            },
            isChannelEditable(channel) {
                if (!this.isHoldEditor) return true;
                let hold = this.slotState.hold;
                return hold.editing && !!hold.editable[HOLD_EDITOR_CHANNELS[channel]];
            },
            getInputLimits(channel) {
                return this.isHoldEditor ? HOLD_INPUT_LIMITS[channel] : undefined;
            },
            getSliderRange(channel) {
                return this.isHoldEditor ? HOLD_SLIDER_RANGES[channel] : SLOT_RANGES[channel];
            },
            getTranslationSliderTitle() {
                let axis = AXIS_LETTERS[this.translationAxis];
                if (this.isHoldEditor) return this.tf('display_sensei.hold.position_slider_hint', { axis });
                return this.tf('display_sensei.ui.translation_slider_hint', { axis });
            },
            getCardTextTip() {
                if (this.cardNote && this.cardNote.tip) return this.t(this.cardNote.tip);
                return this.isHoldEditor ? this.t('display_sensei.info.attachable_hands') : '';
            },
            showsOffHandChoice() {
                return this.isHoldEditor && this.slotState.hold.hand === 'off_hand' && this.slotState.hold.offHand !== 'separate';
            },
            showsHoldHandCopy() {
                return this.isHoldEditor && this.slotState.hold.hand === 'off_hand';
            },
            getHoldNotes() {
                let hold = this.slotState.hold;
                let values = { bone: hold.bone || '' };
                let notes = [];
                let add = (id, entry) => {
                    if (entry) notes.push({ id, text: this.tf(entry.text, values), tip: entry.tip ? this.tf(entry.tip, values) : '' });
                };
                add(`hold_${hold.status}`, HOLD_STATUS_NOTES[hold.status]);
                if (hold.reason && !HOLD_STATUS_NOTES[hold.reason]) add(`hold_${hold.reason}`, HOLD_REASON_NOTES[hold.reason]);
                if (!hold.editing) add('hold_animate', { text: 'display_sensei.hold.note_animate', tip: 'display_sensei.hold.note_animate_tip' });
                return notes;
            },
            getHoldCheckEntry(check) {
                return HOLD_CHECK_TEXTS[check.id.split('.')[0]] || null;
            },
            getHoldCheckValues(check) {
                let values = Object.assign({}, check.values);
                if (HOLD_VIEW_NAMES[values.view]) values.view = this.t(HOLD_VIEW_NAMES[values.view]);
                return values;
            },
            getHoldCheckText(check) {
                let entry = this.getHoldCheckEntry(check);
                return entry ? this.tf(entry.text, this.getHoldCheckValues(check)) : '';
            },
            getHoldCheckTip(check) {
                let entry = this.getHoldCheckEntry(check);
                return entry ? this.tf(entry.tip, this.getHoldCheckValues(check)) : '';
            },
            getHoldFixLabel(check) {
                let fix = HOLD_FIX_LABELS[check.fix];
                return fix ? this.tf(fix.label, this.getHoldCheckValues(check)) : '';
            },
            getHoldFixHint(check) {
                let fix = HOLD_FIX_LABELS[check.fix];
                return fix ? this.tf(fix.hint, this.getHoldCheckValues(check)) : '';
            },
            getWearSlotLabel(slotId) {
                let slot = findWearSlot(slotId);
                return slot ? this.t(slot.label) : String(slotId || '');
            },
            getHoldFileState(file) {
                if (!file.exists) return 'missing';
                if (file.changedAfterWrite) return 'changed';
                if (file.pending) return 'pending';
                if (file.written) return 'written';
                return 'same';
            },
            getHoldFileStateText(file) {
                let state = this.getHoldFileState(file);
                if (state === 'missing') return this.t('display_sensei.hold_write.state_missing');
                if (state === 'changed') return this.t('display_sensei.hold_write.state_changed');
                if (state === 'pending') return this.tf('display_sensei.hold_write.state_pending', { count: file.pending });
                if (state === 'written') return this.t('display_sensei.hold_write.state_written');
                return this.t('display_sensei.hold_write.state_same');
            },
            holdFileChanged() {
                return !!this.holdWrite && this.holdWrite.files.some(file => file.changedAfterWrite);
            },
            canWriteHolds() {
                if (!this.holdWrite || this.holdBusy || this.holdWrite.desktopOnly) return false;
                return (this.holdWrite.pending > 0 && this.holdWrite.files.some(file => file.exists)) || this.holdWrite.noFile.length > 0;
            },
            getHoldBackupFile() {
                let file = this.holdWrite ? this.holdWrite.files.find(entry => entry.hasBackup) : null;
                return file ? file.path : null;
            },
            getScaleSliderTitle() {
                if (this.scaleLocked) return this.t('display_sensei.ui.scale_slider_hint');
                return this.tf('display_sensei.ui.scale_axis_slider_hint', { axis: AXIS_LETTERS[this.scaleAxis] });
            },
            getSubtabLabel(subtabId) {
                let subtab = findSubtab(findMainTab('hand'), subtabId);
                return subtab ? this.t(subtab.label) : '';
            },
            getCalibrationName(calibrationId) {
                let action = CALIBRATION_ACTIONS.find(entry => entry.id === calibrationId);
                return action ? this.t(action.name) : '';
            },
            getSlotNameHint() {
                let slot = this.activeSlot;
                if (!slot || slot.id === slot.bedrockKey) return null;
                return this.tf('display_sensei.info.blockbench_slot_name', { slot: slot.id, key: slot.bedrockKey });
            },
            getEditCardTip() {
                let keys = [this.activeSubtab.info];
                if (this.activeSubtabId === 'third_front') keys.push(SHARED_THIRD_PERSON_NOTE.text);
                if (this.route === 'attachable' && this.activeTab === 'hand') keys.push('display_sensei.info.attachable_hands');
                return keys.map(key => this.t(key)).join('\n');
            },
            getIconHtml(icon) {
                return Blockbench.getIconNode(icon).outerHTML;
            },
            getReferenceName(choice) {
                let key = BLOCKBENCH_REFERENCE_NAMES[choice.id];
                return key ? this.t(key) : choice.name;
            },
            getActiveReferenceName() {
                let active = this.viewState.reference;
                return active ? this.getReferenceName(active) : '';
            },
            showReferenceRow() {
                let active = this.viewState.reference;
                return !!this.viewState.references || (!!active && (!!active.note || active.approximate));
            },
            formatPoseAngle() {
                return `${formatEditorValue(this.viewState.poseAngle.value)}°`;
            },
            isShelfVersionRaised() {
                return !!this.output && VersionUtil.compare(this.output.selected, '<', SHELF_GEOMETRY_VERSION);
            },
            getVersionNotes() {
                let output = this.output;
                let slotId = this.slotState.id;
                if (!output) return [];
                let notes = [];
                if (slotId === 'on_shelf' && this.slotState.copiesItemFrame) {
                    let values = { selected: output.selected };
                    notes.push({
                        id: 'shelf_copies_frame',
                        text: this.tf('display_sensei.info.shelf_copies_frame', values),
                        tip: this.tf('display_sensei.info.shelf_copies_frame_tip', values)
                    });
                }
                if (slotId === 'on_shelf' && this.isShelfVersionRaised()) {
                    let values = { selected: output.selected, version: SHELF_GEOMETRY_VERSION };
                    notes.push({
                        id: 'shelf_version',
                        text: this.tf('display_sensei.info.shelf_version', values),
                        tip: this.tf('display_sensei.info.shelf_version_tip', values)
                    });
                }
                if (slotId === 'gui' && VersionUtil.compare(output.effective, '<', FIT_TO_FRAME_GEOMETRY_VERSION)) {
                    notes.push({ id: 'fit_to_frame_version', text: this.tf('display_sensei.info.fit_to_frame_version', { selected: output.effective, version: FIT_TO_FRAME_GEOMETRY_VERSION }) });
                }
                if (slotId === 'fixed' && VersionUtil.compare(output.effective, '<', ITEM_FRAME_GEOMETRY_VERSION)) {
                    let values = { selected: output.effective, version: ITEM_FRAME_GEOMETRY_VERSION };
                    notes.push({
                        id: 'item_frame_version',
                        text: this.tf('display_sensei.info.item_frame_version', values),
                        tip: this.tf('display_sensei.info.item_frame_version_tip', values)
                    });
                }
                return notes;
            },

            getLinkEmptyText() {
                let key = LINK_EMPTY_TEXTS[this.link.status];
                return key ? this.t(key) : '';
            },
            getLinkEmptyTip() {
                let key = LINK_EMPTY_TIPS[this.link.status];
                return key ? this.t(key) : '';
            },
            getBehaviorPackText() {
                let bp = this.link.bp;
                if (bp.status === 'found') return this.tf('display_sensei.link.bp', { name: bp.name });
                if (bp.status === 'ambiguous') return this.tf('display_sensei.link.bp_ambiguous', { names: bp.candidates.join(', ') });
                return this.t('display_sensei.link.bp_missing');
            },
            getWizardName(wizardId) {
                let key = WIZARD_NAMES[wizardId];
                return key ? this.t(key) : String(wizardId || '');
            },
            getStampText() {
                let stamps = this.link.stamps;
                if (!stamps.length) return this.t('display_sensei.link.no_stamp');
                let tools = stamps.map(stamp => {
                    let name = WIZARD_NAMES[stamp.wizard] ? this.t(WIZARD_NAMES[stamp.wizard]) : stamp.key;
                    return stamp.versions.length ? `${name} ${stamp.versions.join(', ')}` : name;
                });
                return this.tf('display_sensei.link.stamps', { tools: tools.join('; ') });
            },
            getLinkNotes(notes) {
                return (notes || [])
                    .map(note => ({ id: note.id, text: this.getLinkNoteText(note), tip: this.getLinkNoteTip(note) }))
                    .filter(note => note.text);
            },
            getLinkNoteText(note) {
                let wizard = note.values ? note.values.wizard : null;
                let key = note.id === 'reexport' ? WIZARD_REEXPORT_TEXTS[wizard] : LINK_NOTE_TEXTS[note.id];
                return key ? this.tf(key, this.getLinkNoteValues(note)) : '';
            },
            getLinkNoteTip(note) {
                let wizard = note.values ? note.values.wizard : null;
                let key = note.id === 'reexport' ? WIZARD_REEXPORT_TIPS[wizard] : LINK_NOTE_TIPS[note.id];
                return key ? this.tf(key, this.getLinkNoteValues(note)) : '';
            },
            getLinkNoteValues(note) {
                let values = Object.assign({}, note.values);
                if (ITEM_WIZARD_PRESET_NAMES[values.preset]) {
                    values.preset = this.t(ITEM_WIZARD_PRESET_NAMES[values.preset]);
                }
                if (Array.isArray(values.losses)) {
                    let sentences = [];
                    for (let loss of values.losses) {
                        if (BLOCK_WIZARD_LOSS_TEXTS[loss]) sentences.push(this.t(BLOCK_WIZARD_LOSS_TEXTS[loss]));
                    }
                    values.features = sentences.join(' ');
                }
                return values;
            },
            getLinkFileGroups() {
                let groups = [];
                for (let group of LINK_FILE_GROUPS) {
                    let rows = this.link.files.filter(row => getLinkFileGroupId(row) === group.id);
                    if (rows.length) groups.push({ id: group.id, label: group.label, rows });
                }
                return groups;
            },
            getPathParts(path) {
                let parts = String(path).split('/');
                return parts
                    .map((part, index) => (index < parts.length - 1 ? part + '/' : part))
                    .filter(part => part !== '');
            },
            getLinkKindLabel(row) {
                return this.t(row.kind === 'look' ? 'display_sensei.link.kind_look' : 'display_sensei.link.kind_code');
            },
            getLinkKindHint(row) {
                return this.t(row.kind === 'look' ? 'display_sensei.link.kind_look_hint' : 'display_sensei.link.kind_code_hint');
            },
            getRewrittenHint() {
                let key = WIZARD_REWRITTEN_HINTS[this.link.wizard];
                return key ? this.t(key) : '';
            },
            getLinkFileDetail(row) {
                let parts = [LINK_ROLE_NAMES[row.role] ? this.t(LINK_ROLE_NAMES[row.role]) : row.role];
                if (row.pack === 'game') {
                    parts.push(this.t('display_sensei.link.game_detail'));
                } else if (row.maybe_game) {
                    parts.push(this.t('display_sensei.link.maybe_game_detail'));
                } else if (row.exists === false && LINK_ROLES_USING_ID.includes(row.role)) {
                    parts.push(this.tf('display_sensei.link.not_found_uses_detail', { path: row.path, id: row.id || '' }));
                } else if (row.exists === false) {
                    parts.push(this.tf('display_sensei.link.not_found_detail', { path: row.path, id: row.id || '' }));
                } else if (row.exists !== true) {
                    let ambiguous = this.link.bp && this.link.bp.status === 'ambiguous';
                    parts.push(this.t(ambiguous ? 'display_sensei.link.bp_ambiguous_detail' : 'display_sensei.link.bp_unknown_detail'));
                }
                return parts.join(' · ');
            },
            showLinkActions() {
                return !this.link || this.link.status !== 'desktop_only';
            },

            getInfoCardText() {
                let card = this.infoCard;
                return (card.routeTexts && card.routeTexts[this.route]) || card.text;
            },
            getInfoCardTip() {
                let card = this.infoCard;
                return (card.routeTips && card.routeTips[this.route]) || card.tip;
            },
            isWornSubtab(subtabId) {
                return this.activeTab === 'armor' && !!this.wearInfo && this.wearInfo.slot === subtabId;
            },
            getWearKindEntry() {
                let wear = this.wearInfo;
                if (!wear || !WEAR_KIND_TEXTS[wear.kind] || wear.kind === 'unknown') return WEAR_KIND_TEXTS.unknown;
                if (wear.kind === 'held' && wear.slot) return HELD_IN_SLOT_TEXT;
                if (wear.kind === 'worn' && !wear.slot) return WORN_ELSEWHERE_TEXT;
                return WEAR_KIND_TEXTS[wear.kind];
            },
            getWearSource() {
                let wear = this.wearInfo;
                let entry = this.getWearKindEntry();
                return entry !== WEAR_KIND_TEXTS.unknown && wear ? WEAR_SOURCE_TEXTS[wear.source] || null : null;
            },
            getWearInfoText() {
                let wear = this.wearInfo;
                let slot = (wear && (wear.slot || (wear.slots || []).join(', '))) || this.t('display_sensei.armor.slot_unknown');
                let text = this.tf(this.getWearKindEntry().text, { slot });
                let source = this.getWearSource();
                return source ? `${text} ${this.t(source.text)}` : text;
            },
            getWearInfoTip() {
                let source = this.getWearSource();
                return [this.getWearKindEntry().tip, source && source.tip]
                    .filter(Boolean)
                    .map(key => this.t(key))
                    .join(' ');
            },
            getWornSlotTip() {
                let slot = this.armorWornSlot;
                let lines = [this.getWearInfoText()];
                if (slot) lines.push(this.tf('display_sensei.armor.other_slot_tip', { slot: slot.wearableSlot, tab: this.t(slot.label) }));
                return lines.join('\n');
            },
            getWearKindChoice() {
                let wear = this.wearInfo;
                return wear && wear.source === 'saved' && WEAR_KINDS.some(choice => choice.id === wear.kind) ? wear.kind : 'auto';
            },
            findArmorWearer() {
                return this.armor.wearers.find(choice => choice.id === this.armor.wearer) || null;
            },
            getWearerName() {
                let wearer = this.findArmorWearer();
                return wearer ? this.t(wearer.label) : '';
            },
            isWearerShaded() {
                let wearer = this.findArmorWearer();
                return !!wearer && !wearer.textured;
            },
            getSeverityLabel(severity) {
                let key = ARMOR_SEVERITY_LABELS[severity];
                return key ? this.t(key) : String(severity);
            },
            getFixLabel(fixId) {
                let fix = ARMOR_FIX_LABELS[fixId];
                return fix ? this.t(fix.label) : String(fixId);
            },
            getFixHint(fixId) {
                let fix = ARMOR_FIX_LABELS[fixId];
                return fix ? this.t(fix.hint) : '';
            },
            getCheckTip(check) {
                let lines = [];
                let tip = ARMOR_CHECK_TIPS[check.textKey];
                if (tip) lines.push(this.tf(tip, check.values));
                if (check.bones && check.bones.length) lines.push(this.tf('display_sensei.armor.check_bones', { bones: check.bones.join(', ') }));
                return lines.join('\n');
            },
            getFitTargetName(row) {
                if (!row.target || row.target === row.name) return '';
                return this.tf('display_sensei.armor.fit_target', { bone: row.target });
            },
            getChosenPoseNote() {
                let chosen = this.armor.poses.filter(pose => pose.chosen).map(pose => this.t(pose.label));
                return chosen.length ? this.tf('display_sensei.armor.poses_chosen', { poses: chosen.join(', ') }) : '';
            },

            setMainTab(tabId) {
                if (!findMainTab(tabId)) return;
                this.releasePointer();
                this.activeTab = tabId;
                this.saveState();
                if (this.activeSubtabId) {
                    this.showOwnContext(this.activeSubtabId, this.hand);
                }
                this.syncLinkState(tabId === 'output');
                this.syncArmorState();
                if (this.route === 'attachable') this.syncHoldCard(tabId === 'output');
            },
            setSubtab(subtabId) {
                if (!this.currentSubtabs.some(subtab => subtab.id === subtabId)) return;
                this.releasePointer();
                this.activeSubtabs[this.activeTab] = subtabId;
                this.saveState();
                this.showOwnContext(subtabId, this.hand);
                this.syncArmorState();
                if (this.route === 'attachable') this.syncHoldCard();
            },
            showOwnContext(subtabId, handId) {
                this.showingOwnContext = true;
                try {
                    if (this.route === 'attachable') return this.showOwnHoldView(subtabId, handId);
                    return showContext(subtabId, handId);
                } finally {
                    this.showingOwnContext = false;
                }
            },
            showOwnHoldView(subtabId, handId) {
                this.syncHoldContext();
                if (!this.holdSlotId || !isPanelVisible()) {
                    hideHoldView();
                    return null;
                }
                return showHoldView(subtabId, handId, true);
            },
            syncHoldCard(forceFiles = false) {
                this.syncHoldContext();
                this.syncSlotState();
                this.syncHoldView();
                this.syncHandViews();
                this.syncHoldOutput(forceFiles);
            },
            goToLeftHand() {
                this.setHand('left');
                this.setMainTab('hand');
            },
            openArmorSubtab(subtabId) {
                if (!findSubtab(findMainTab('armor'), subtabId)) return;
                this.activeSubtabs.armor = subtabId;
                this.setMainTab('armor');
            },
            setHand(handId) {
                if (!findHand(handId)) return;
                this.releasePointer();
                this.hand = handId;
                this.saveState();
                this.showOwnContext(this.activeSubtabId, handId);
                if (this.route === 'attachable') this.syncHoldCard();
            },
            setBackCamera(style) {
                if (!BACK_CAMERA_OPTIONS.some(option => option.id === style)) return;
                this.backCamera = style;
                setBackCameraStyle(style);
                this.saveState();
                this.showOwnContext(this.activeSubtabId, this.hand);
                if (this.route === 'attachable') this.syncHoldCard();
            },
            saveState() {
                saveUiState({
                    tab: this.activeTab,
                    subtabs: this.activeSubtabs,
                    hand: this.hand,
                    channel: this.activeChannel,
                    moveStep: this.moveStep,
                    translationAxis: this.translationAxis,
                    rotationAxis: this.rotationAxis,
                    scaleAxis: this.scaleAxis,
                    scaleLocked: this.scaleLocked,
                    advancedOpen: this.advancedOpen,
                    viewOpen: this.viewOpen,
                    handViewsOpen: this.handViewsOpen,
                    presetScope: this.presetScope,
                    backCamera: this.backCamera,
                    armorWearer: this.armorWearer,
                    armorOverlay: this.armorOverlay,
                    armorFitChannel: this.armorFitChannel,
                    armorFactsOpen: this.armorFactsOpen
                });
            },

            refreshFromBlockbench() {
                this.route = getRoute();
                this.formatId = getFormatId();
                this.syncPanelMode();
                this.followDisplayMode();
                this.syncCard();
            },
            syncPanelMode() {
                this.panelMode = getPanelMode();
            },
            followDisplayMode() {
                let active = getActiveContext();
                let key = active ? `${active.subtabId}/${active.handId || ''}` : '';
                if (key === this.followedContextKey) return;
                this.followedContextKey = key;
                if (this.showingOwnContext) return;
                if (!active || !findMainTab(active.tabId)) return;
                if (this.showsSameView(active)) return;
                this.activeTab = active.tabId;
                this.activeSubtabs[active.tabId] = active.subtabId;
                if (active.handId) this.hand = active.handId;
                this.saveState();
            },
            showsSameView(active) {
                let current = findContextView(this.activeSubtabId, this.hand);
                let shown = findContextView(active.subtabId, active.handId);
                return !!current && !!shown && current.slotId === shown.slotId && current.camera === shown.camera;
            },
            syncCard() {
                if (this.route === 'block' && !this.presetChoices.length) {
                    this.presetChoices = getPresetChoices() || [];
                }
                this.entityKeepsTransforms = hasEntityDisplayTransforms();
                this.syncHoldContext();
                this.syncSlotState();
                this.syncViewState();
                this.syncPivotMarkers();
                this.syncOutputState();
                this.syncLinkState();
                this.syncArmorState();
                this.syncHoldOutput();
            },
            syncHoldContext() {
                if (this.route !== 'attachable') {
                    this.holdWearSlot = null;
                    this.holdOverview = null;
                    this.holdPresetChoices = [];
                    return;
                }
                let worn = getHoldWearState();
                this.holdWearSlot = worn.worn ? (worn.slot || '') : null;
                if (this.activeTab !== 'hand' || worn.worn) {
                    this.holdOverview = null;
                    return;
                }
                prepareHoldEditing();
                this.holdOverview = getHoldOverview();
                this.holdPresetChoices = getHoldPresetChoices();
                if (this.presetId && !this.holdPresetChoices.some(choice => choice.id === this.presetId)) this.presetId = '';
            },
            syncHoldView() {
                if (this.showHoldEditor && isPanelVisible()) {
                    showHoldView(this.activeSubtabId, this.hand, false);
                } else {
                    hideHoldView();
                }
                this.holdView = getHeldPreviewState();
            },
            syncHoldOutput(forceFiles = false) {
                if (this.route !== 'attachable' || this.activeTab !== 'output') {
                    this.holdWrite = null;
                    this.holdJson = '';
                    this.holdAttachableLines = '';
                    return;
                }
                this.holdWrite = getHoldWriteState(forceFiles);
                this.holdJson = buildHoldAnimationText();
                this.holdAttachableLines = buildAttachableHoldLines();
            },
            readHoldSlotState(slotId) {
                let hold = getHoldState(slotId);
                if (!hold) return null;
                return {
                    id: slotId,
                    values: {
                        translation: hold.values.position,
                        rotation: hold.values.rotation,
                        scale: hold.values.scale,
                        rotation_pivot: [0, 0, 0],
                        scale_pivot: [0, 0, 0]
                    },
                    inherited: hold.sameAsMain,
                    fitToFrame: null,
                    copiesItemFrame: false,
                    handFallbackNote: null,
                    gimbal: hold.gimbal,
                    hold
                };
            },
            syncViewState() {
                let slotId = this.cardSlotId;
                let references = slotId ? getReferenceChoices(slotId) : null;
                let options = (slotId && getReferenceOptions(slotId)) || [];
                this.viewState = {
                    shown: !!slotId && isShowingSlot(slotId),
                    references: references && references.length > 1 ? references : null,
                    reference: (references && references.find(choice => choice.active)) || null,
                    poseAngle: slotId ? getPoseAngle(slotId) : null,
                    previewAnimation: slotId ? getPreviewAnimation(slotId) : null,
                    options: options.filter(option => option.id !== FIT_PREVIEW_OPTION_ID),
                    fitPreview: options.find(option => option.id === FIT_PREVIEW_OPTION_ID) || null,
                    skin: !!slotId && canOpenSkinDialog()
                };
                this.syncHoldView();
                this.syncHandViews();
            },

            syncHandViews() {
                let views;
                if (this.isHoldEditor) {
                    views = this.holdView.shown ? getHoldViewChoices(this.activeSubtabId, this.hand) : null;
                } else {
                    views = this.viewState.shown ? getHandViewChoices() : null;
                }
                let key = views ? views.map(view => `${view.subtabId}/${view.handId}`).join() : '';
                this.handViews = views;
                if (!views || !this.handViewsOpen) {
                    this.handViewsKey = '';
                    return;
                }
                if (key !== this.handViewsKey) {
                    this.handViewsKey = key;
                    this.$nextTick(() => this.drawHandViews());
                } else {
                    this.scheduleHandViews();
                }
            },
            scheduleHandViews() {
                if (this.handViewTimer) return;
                this.handViewTimer = setTimeout(() => {
                    this.handViewTimer = null;
                    this.drawHandViews();
                }, HAND_VIEW_REFRESH_MS);
            },
            drawHandViews() {
                let canvases = [].concat(this.$refs.handViewCanvas || []);
                if (!this.handViews || !this.handViewsOpen) return;
                if (!isPanelVisible()) {
                    this.handViewsKey = '';
                    return;
                }
                for (let canvas of canvases) {
                    let view = this.handViews.find(entry => entry.subtabId === canvas.getAttribute('data-ds-hand-view-canvas'));
                    let draw = this.route === 'attachable' ? renderHoldView : renderHandView;
                    let image = view ? draw(view.subtabId, view.handId, canvas.width, canvas.height) : null;
                    if (image) canvas.getContext('2d').putImageData(image, 0, 0);
                    canvas.classList.toggle('ds-stale', !image);
                }
            },
            onPanelShown() {
                if (this.route === 'attachable') {
                    let shown = this.holdView.shown;
                    this.syncHoldView();
                    if (shown !== this.holdView.shown) this.handViewsKey = '';
                }
                if (!this.handViewsKey && isPanelVisible()) this.syncHandViews();
            },
            syncPivotMarkers() {
                let slotId = this.advancedOpen && this.showBlockEditor && isPanelVisible() ? this.cardSlotId : '';
                this.pivotMarkersShown = setPivotMarkersShown(!!slotId, slotId || null);
            },
            toggleHandViews() {
                this.handViewsOpen = !this.handViewsOpen;
                this.saveState();
                this.handViewsKey = '';
                this.syncHandViews();
            },
            refreshPresetChoices() {
                if (this.route === 'attachable') {
                    this.holdPresetChoices = getHoldPresetChoices();
                    if (this.presetId && !this.holdPresetChoices.some(choice => choice.id === this.presetId)) this.presetId = '';
                    return;
                }
                if (this.route !== 'block') return;
                this.presetChoices = getPresetChoices() || [];
                if (this.presetId && !this.presetChoices.some(choice => choice.id === this.presetId)) {
                    this.presetId = '';
                }
            },
            syncSlotState() {
                if (this.holdSlotId) {
                    this.slotState = this.readHoldSlotState(this.holdSlotId);
                    return;
                }
                let slotId = this.cardSlotId;
                let values = slotId ? getSlotValues(slotId) : null;
                if (!values) {
                    this.slotState = null;
                    return;
                }
                this.slotState = {
                    id: slotId,
                    values,
                    inherited: isSlotInherited(slotId) === true,
                    fitToFrame: slotId === 'gui' ? values.fit_to_frame !== false : null,
                    copiesItemFrame: slotId === 'on_shelf' && shelfCopiesItemFrame(),
                    handFallbackNote: getHandFallbackNote(slotId),
                    gimbal: getGimbalState(slotId)
                };
            },
            syncOutputState() {
                if (this.route !== 'block') {
                    this.output = null;
                    return;
                }
                let transforms = buildItemDisplayTransforms();
                let selected = getGeometryVersion();
                let effective = getEffectiveGeometryVersion();
                this.output = {
                    choices: getGeometryVersionChoices() || [],
                    selected,
                    effective,
                    raised: !!transforms && effective !== selected,
                    text: transforms ? formatTransformsProperty(transforms) : ''
                };
            },
            syncLinkState(force = false) {
                let bedrock = this.route !== 'none';
                let attachableNotes = this.route === 'attachable' && (this.activeTab === 'hand' || this.activeTab === 'armor');
                let shown = bedrock && (this.activeTab === 'output' || attachableNotes);
                let view = shown ? getPackLinkView() : null;
                this.link = this.activeTab === 'output' ? view : null;
                this.linkHandNotes = view && this.activeTab === 'hand'
                    ? view.notes.filter(note => HAND_CARD_NOTE_IDS.includes(note.id))
                    : [];
                this.linkArmorNotes = view && this.activeTab === 'armor'
                    ? view.notes.filter(note => ARMOR_CARD_NOTE_IDS.includes(note.id))
                    : [];
                if (shown || (bedrock && isPackScanNeededForRoute())) requestPackLinkScan(Project, force);
            },
            onProjectSaved(event) {
                if (!event || event.saved !== true || event.project !== Project) return;
                this.syncLinkState(true);
            },

            syncArmorState() {
                let onArmorTab = this.route === 'attachable' && this.activeTab === 'armor';
                this.wearInfo = onArmorTab ? getWearInfo() : null;
                if (onArmorTab) this.followWornSubtab();
                let slotId = this.armorSlotId;
                if (!slotId) {
                    this.armor = null;
                    this.syncArmorPreview();
                    return;
                }
                let wearer = getWearer();
                let preview = getArmorPreviewState() || {};
                let fitRows = this.readFitRows(slotId);
                let wornSlot = this.wearInfo ? findWearSlot(this.wearInfo.slot) : null;
                let onWornSlot = !wornSlot || wornSlot.id === slotId;
                this.armorWearer = wearer;
                this.armor = {
                    slotId,
                    wearers: getWearerChoices(),
                    wearer,
                    flatTexture: getOverlayOptions().flatTexture || null,
                    textures: Array.isArray(preview.textures) ? preview.textures : [],
                    camera: typeof preview.camera === 'string' ? preview.camera : null,
                    checks: onWornSlot ? runArmorChecks(slotId, wearer) || [] : [],
                    poses: getPoseChoices(wearer) || [],
                    activePose: getActivePose() || null,
                    fitPreview: preview.fitPreview === true,
                    fitRows,
                    hasFitOffsets: fitRows.some(row => row.moved)
                };
                this.syncArmorPreview();
            },
            followWornSubtab() {
                let slotId = (this.wearInfo && this.wearInfo.slot) || null;
                if (!Project || followedWearSlots.get(Project) === slotId) return;
                followedWearSlots.set(Project, slotId);
                if (!findSubtab(findMainTab('armor'), slotId) || this.activeSubtabs.armor === slotId) return;
                this.activeSubtabs.armor = slotId;
                this.saveState();
            },
            getWornArmorSlotId() {
                let slot = this.wearInfo ? findWearSlot(this.wearInfo.slot) : null;
                return slot && slot.support.attachable === 'armor' ? slot.id : '';
            },
            readFitRows(slotId) {
                let offsets = getFitOffsets(slotId) || {};
                return Object.keys(offsets).map(name => {
                    let values = readFitValues(offsets[name]);
                    let moved = FIT_CHANNELS.some(channel => values[channel.id].some((value, axis) => !sameNumber(value, FIT_DEFAULTS[channel.id][axis])));
                    return { name, target: findCanonicalWearerBone(name), values, moved };
                });
            },
            syncArmorPreview() {
                let cardShown = !!this.armorSlotId;
                if (this.armorCardShown && !cardShown) {
                    stopPoseTest();
                    setFitPreview(false);
                }
                this.armorCardShown = cardShown;
                setArmorPreviewSlot(cardShown ? this.getWornArmorSlotId() || this.armorSlotId : null);
                let show = cardShown && this.armorOverlay.show;
                let key = show ? String(Project.uuid) : '';
                if (key === this.overlayProjectKey) return;
                this.overlayProjectKey = key;
                setOverlayOptions({ show });
            },
            endArmorPreview() {
                if (this.armorCardShown) {
                    stopPoseTest();
                    setFitPreview(false);
                }
                if (this.overlayProjectKey) setOverlayOptions({ show: false });
                setArmorPreviewSlot(null);
                this.armorCardShown = false;
                this.overlayProjectKey = '';
            },

            setWearKindFrom(event) {
                let kind = event.target.value;
                if (this.armor && WEAR_KINDS.some(choice => choice.id === kind)) {
                    let found = this.wearInfo && this.wearInfo.slot;
                    let slot = (kind === 'armor' || kind === 'worn') && !found ? this.armor.slotId : null;
                    setWearKind(kind, slot);
                }
                this.syncCard();
                event.target.value = this.getWearKindChoice();
            },
            setWearerFrom(event) {
                setWearer(event.target.value);
                this.armorWearer = getWearer();
                this.saveState();
                this.syncArmorState();
                event.target.value = this.armorWearer;
            },
            setOverlayToggle(optionId, event) {
                if (!ARMOR_OVERLAY_TOGGLES.some(toggle => toggle.id === optionId)) return;
                this.armorOverlay[optionId] = event.target.checked;
                this.saveState();
                if (optionId === 'show') {
                    this.syncArmorPreview();
                } else {
                    setOverlayOptions({ [optionId]: event.target.checked });
                }
                this.syncArmorState();
            },
            setOtherSlotsFrom(event) {
                if (ARMOR_OTHER_SLOTS.some(choice => choice.id === event.target.value)) {
                    this.armorOverlay.otherSlots = event.target.value;
                    this.saveState();
                    setOverlayOptions({ otherSlots: event.target.value });
                }
                this.syncArmorState();
                event.target.value = this.armorOverlay.otherSlots;
            },
            setFlatTextureFrom(event) {
                setOverlayOptions({ flatTexture: event.target.value || null });
                this.syncArmorState();
                event.target.value = this.armor ? this.armor.flatTexture || '' : '';
            },

            showArmorCamera(viewId) {
                this.releasePointer();
                applyArmorCamera(viewId);
                this.syncArmorState();
            },
            restoreCamera() {
                this.releasePointer();
                restoreArmorCamera();
                this.syncArmorState();
            },
            togglePose(poseId) {
                this.releasePointer();
                if (!this.armor) return;
                if (this.armor.activePose === poseId) {
                    stopPoseTest();
                } else if (startPoseTest(poseId) === false) {
                    showMessage('display_sensei.message.armor_pose_edit_mode');
                }
                this.syncArmorState();
            },

            applyFix(check, fixId) {
                this.releasePointer();
                if (!this.armor) return;
                if (!applyArmorFix(check.id, fixId, this.armor.slotId, this.armor.wearer)) {
                    showMessage('display_sensei.message.armor_fix_failed');
                }
                this.syncCard();
            },
            setArmorFitChannel(channelId) {
                if (!FIT_CHANNELS.some(channel => channel.id === channelId)) return;
                this.armorFitChannel = channelId;
                this.saveState();
            },
            commitFitOffset(boneName, channel, axis, event) {
                let input = event.target;
                let slotId = this.armor ? this.armor.slotId : '';
                let value = parseFloat(input.value);
                if (slotId && Number.isFinite(value)) {
                    let current = readFitValues((getFitOffsets(slotId) || {})[boneName])[channel];
                    if (!sameNumber(current[axis], value)) {
                        let next = current.slice();
                        next[axis] = value;
                        setFitOffset(slotId, boneName, channel, next);
                    }
                }
                this.syncCard();
                let row = this.armor ? this.armor.fitRows.find(entry => entry.name === boneName) : null;
                if (row) input.value = formatEditorValue(row.values[channel][axis]);
            },
            resetFit() {
                this.releasePointer();
                if (this.armor) resetFitOffsets(this.armor.slotId);
                this.syncCard();
            },
            bakeFit() {
                this.releasePointer();
                if (!this.armor) return;
                if (!bakeFitOffsets(this.armor.slotId)) {
                    showMessage('display_sensei.message.armor_bake_failed');
                }
                this.syncCard();
            },
            setFitPreviewFrom(event) {
                setFitPreview(event.target.checked);
                this.syncArmorState();
                event.target.checked = !!this.armor && this.armor.fitPreview;
            },
            toggleArmorFacts() {
                this.armorFactsOpen = !this.armorFactsOpen;
                this.saveState();
            },

            setChannel(channelId) {
                if (!CHANNEL_TABS.some(channel => channel.id === channelId)) return;
                this.releasePointer();
                this.activeChannel = channelId;
                this.saveState();
            },
            setMoveStep(event) {
                let step = Number(event.target.value);
                if (MOVE_STEPS.includes(step)) {
                    this.moveStep = step;
                    this.saveState();
                }
                event.target.value = String(this.moveStep);
            },
            setTranslationAxis(axis) {
                this.translationAxis = axis;
                this.saveState();
            },
            setRotationAxis(axis) {
                this.rotationAxis = axis;
                this.saveState();
            },
            setScaleAxis(axis) {
                this.scaleAxis = axis;
                this.saveState();
            },
            setScaleLocked(event) {
                this.scaleLocked = event.target.checked;
                this.saveState();
            },
            toggleAdvanced() {
                this.advancedOpen = !this.advancedOpen;
                this.saveState();
                this.syncPivotMarkers();
            },
            toggleView() {
                this.viewOpen = !this.viewOpen;
                this.saveState();
            },
            setPresetScope(event) {
                if (PRESET_SCOPES.some(scope => scope.id === event.target.value)) {
                    this.presetScope = event.target.value;
                    this.saveState();
                }
                event.target.value = this.presetScope;
            },

            editorValues(slotId) {
                if (this.route !== 'attachable') return getSlotValues(slotId);
                let values = getHoldValues(slotId);
                return values ? { translation: values.position, rotation: values.rotation, scale: values.scale } : null;
            },
            editorReadTyped(channel, text) {
                if (this.route !== 'attachable') return readTypedValue(channel, text);
                return sanitizeHoldValue(HOLD_EDITOR_CHANNELS[channel], text);
            },
            editorSetChannel(slotId, channel, values) {
                if (this.route !== 'attachable') return setSlotChannel(slotId, channel, values);
                return setHoldChannel(slotId, HOLD_EDITOR_CHANNELS[channel], values);
            },
            editorSetAxis(slotId, channel, axis, value) {
                if (this.route !== 'attachable') return setSlotAxis(slotId, channel, axis, value);
                return setHoldAxis(slotId, HOLD_EDITOR_CHANNELS[channel], axis, value);
            },
            editorBegin(slotId) {
                return this.route === 'attachable' ? beginHoldEdit() : beginSlotEdit([slotId]);
            },
            editorIsOpen(route) {
                return route === 'attachable' ? isOwnHoldEditOpen() : isOwnSlotEditOpen();
            },
            editorFinish(route) {
                return route === 'attachable' ? finishHoldEdit() : finishSlotEdit();
            },
            editorCancel(route) {
                return route === 'attachable' ? cancelHoldEdit() : cancelSlotEdit();
            },
            commitAxis(channel, axis, event) {
                let input = event.target;
                let slotId = this.slotState && this.slotState.id;
                let current = slotId ? this.editorValues(slotId) : null;
                let value = this.editorReadTyped(channel, input.value);
                if (current && value !== null) {
                    let linked = channel === 'scale' && this.scaleLocked;
                    let same = channel === 'rotation' ? sameAngle : sameNumber;
                    if (linked && !current.scale.every(old => sameNumber(old, value))) {
                        this.editorSetChannel(slotId, 'scale', [value, value, value]);
                    } else if (!linked && !same(current[channel][axis], value)) {
                        this.editorSetAxis(slotId, channel, axis, value);
                    }
                }
                this.syncCard();
                if (this.slotState) {
                    input.value = formatEditorValue(this.slotState.values[channel][axis]);
                }
            },

            beginGesture(event) {
                if (event && event.type === 'mousedown' && event.button !== 0) return false;
                this.releasePointer();
                if (!this.slotState) return false;
                let slotId = this.slotState.id;
                let route = this.route;
                this.gesture = { slotId, route, project: Project, ownsEdit: this.editorBegin(slotId), cancelled: false };
                window.addEventListener('mouseup', this.onWindowPointerUp, true);
                window.addEventListener('touchend', this.onWindowPointerUp, true);
                window.addEventListener('touchcancel', this.onWindowPointerUp, true);
                window.addEventListener('blur', this.onWindowPointerUp);
                window.addEventListener('keydown', this.onWindowKeyDown, true);
                return true;
            },
            ensureGestureEdit() {
                let gesture = this.gesture;
                if (gesture && !gesture.cancelled && gesture.route === this.route && !this.editorIsOpen(gesture.route)) {
                    gesture.ownsEdit = this.editorBegin(gesture.slotId);
                }
            },
            stopNudgeRepeat() {
                clearTimeout(this.nudgeDelayTimer);
                clearInterval(this.nudgeRepeatTimer);
                this.nudgeDelayTimer = null;
                this.nudgeRepeatTimer = null;
            },
            releasePointer() {
                this.stopNudgeRepeat();
                let gesture = this.gesture;
                if (!gesture) return;
                this.gesture = null;
                window.removeEventListener('mouseup', this.onWindowPointerUp, true);
                window.removeEventListener('touchend', this.onWindowPointerUp, true);
                window.removeEventListener('touchcancel', this.onWindowPointerUp, true);
                window.removeEventListener('blur', this.onWindowPointerUp);
                window.removeEventListener('keydown', this.onWindowKeyDown, true);
                if (gesture.cancelled) {
                    this.$forceUpdate();
                } else if (gesture.ownsEdit) {
                    this.editorFinish(gesture.route);
                }
            },
            cancelGesture() {
                let gesture = this.gesture;
                if (!gesture || gesture.cancelled) return false;
                this.stopNudgeRepeat();
                gesture.cancelled = true;
                if (gesture.ownsEdit) this.editorCancel(gesture.route);
                if (this.$el.contains(document.activeElement)) document.activeElement.blur();
                this.syncCard();
                return true;
            },
            endGestureOf(project) {
                if (this.gesture && this.gesture.project === project) {
                    this.releasePointer();
                }
            },
            getEditSlotId() {
                if (this.gesture) return this.gesture.cancelled ? null : this.gesture.slotId;
                return this.slotState ? this.slotState.id : null;
            },
            startNudge(nudge, event) {
                if (!this.beginGesture(event)) return;
                this.nudgeStep(nudge);
                this.nudgeDelayTimer = setTimeout(() => {
                    this.nudgeRepeatTimer = setInterval(() => this.nudgeStep(nudge), NUDGE_REPEAT_INTERVAL_MS);
                }, NUDGE_REPEAT_DELAY_MS);
            },
            nudgeStep(nudge) {
                let slotId = this.getEditSlotId();
                let values = slotId ? this.editorValues(slotId) : null;
                if (!values) {
                    this.releasePointer();
                    return;
                }
                this.ensureGestureEdit();
                let next = roundEditorValue(values.translation[nudge.axis] + nudge.sign * this.moveStep);
                this.editorSetAxis(slotId, 'translation', nudge.axis, next);
            },
            nudgeFromKeyboard(nudge, event) {
                if (event.detail === 0) {
                    this.nudgeStep(nudge);
                }
            },
            onRotationSlider(event) {
                let slotId = this.getEditSlotId();
                if (!slotId) return;
                this.ensureGestureEdit();
                this.editorSetAxis(slotId, 'rotation', this.rotationAxis, Number(event.target.value));
            },
            setRotationQuickValue(value) {
                let slotId = this.getEditSlotId();
                let current = slotId ? this.editorValues(slotId) : null;
                if (current && !sameAngle(current.rotation[this.rotationAxis], value)) {
                    this.editorSetAxis(slotId, 'rotation', this.rotationAxis, value);
                }
            },
            onTranslationSlider(event) {
                let slotId = this.getEditSlotId();
                if (!slotId) return;
                this.ensureGestureEdit();
                this.editorSetAxis(slotId, 'translation', this.translationAxis, Number(event.target.value));
            },
            onScaleSlider(event) {
                let slotId = this.getEditSlotId();
                let value = Number(event.target.value);
                if (!slotId) return;
                this.ensureGestureEdit();
                if (this.scaleLocked) {
                    this.editorSetChannel(slotId, 'scale', [value, value, value]);
                } else {
                    this.editorSetAxis(slotId, 'scale', this.scaleAxis, value);
                }
            },
            setUniformScale(value) {
                let slotId = this.getEditSlotId();
                let current = slotId ? this.editorValues(slotId) : null;
                if (current && !current.scale.every(old => sameNumber(old, value))) {
                    this.editorSetChannel(slotId, 'scale', [value, value, value]);
                }
            },

            setInherited(event) {
                if (this.isHoldEditor) {
                    setHoldOffHandSame(this.slotState.hold.view, event.target.checked);
                } else if (this.slotState) {
                    setSlotInherited(this.slotState.id, event.target.checked);
                }
                this.syncCard();
                event.target.checked = !!this.slotState && this.slotState.inherited;
            },
            setFitToFrame(event) {
                setGuiFitToFrame(event.target.checked);
                this.syncCard();
                event.target.checked = !!this.slotState && this.slotState.fitToFrame === true;
            },
            mirrorSlot() {
                if (this.isHoldEditor) {
                    copyHoldFromOtherHand(this.slotState.id, true);
                    this.syncCard();
                } else if (this.slotState) {
                    mirrorFromOtherHand(this.slotState.id);
                }
            },
            samePoseSlot() {
                if (this.isHoldEditor) {
                    copyHoldFromOtherHand(this.slotState.id, false);
                    this.syncCard();
                } else if (this.slotState) {
                    samePoseFromOtherHand(this.slotState.id);
                }
            },
            matchFirstPerson() {
                this.releasePointer();
                if (this.isHoldEditor) {
                    let holdResult = matchHoldFirstPerson();
                    this.syncCard();
                    if (holdResult) Blockbench.showQuickMessage(this.describeHoldMatch(holdResult), QUICK_MESSAGE_MS);
                    return;
                }
                let result = this.slotState ? matchFirstPersonToThirdPerson() : null;
                if (!result) return;
                Blockbench.showQuickMessage(this.describeMatch(result), QUICK_MESSAGE_MS);
            },
            describeHoldMatch(result) {
                let handName = slotId => this.t(slotId === 'firstperson_righthand' ? 'display_sensei.ui.right_hand' : 'display_sensei.ui.left_hand');
                let parts = [];
                if (!result.written.length) {
                    parts.push(this.t(result.readOnly.length ? 'display_sensei.message.hold_match_read_only' : 'display_sensei.message.hold_nothing_to_match'));
                } else if (result.kept.length) {
                    parts.push(this.tf('display_sensei.message.hold_matched_hand', { hand: handName(result.written[0]), kept: handName(result.kept[0]) }));
                } else {
                    parts.push(this.t('display_sensei.message.hold_matched'));
                }
                if (result.written.length && HOLD_MATCH_STARTS[result.start]) parts.push(this.t(HOLD_MATCH_STARTS[result.start]));
                if (result.clamped.length) parts.push(this.t('display_sensei.message.hold_clamped'));
                if (result.turned > 0) parts.push(this.tf('display_sensei.message.first_person_turned', { change: formatEditorValue(result.turned) }));
                return parts.join(' ');
            },
            describeMatch(result) {
                let handName = slotId => this.t(slotId === 'firstperson_righthand' ? 'display_sensei.ui.right_hand' : 'display_sensei.ui.left_hand');
                let parts = [];
                if (!result.written.length) {
                    parts.push(this.t('display_sensei.message.first_person_nothing_to_match'));
                } else if (result.kept.length) {
                    parts.push(this.tf('display_sensei.message.first_person_matched_hand', { hand: handName(result.written[0]), kept: handName(result.kept[0]) }));
                } else {
                    parts.push(this.t('display_sensei.message.first_person_matched'));
                }
                if (result.clamped.length) parts.push(this.t('display_sensei.message.first_person_clamped'));
                if (result.turned > 0) parts.push(this.tf('display_sensei.message.first_person_turned', { change: formatEditorValue(result.turned) }));
                return parts.join(' ');
            },
            turnSlot(axis) {
                if (this.isHoldEditor) {
                    turnHold180(this.slotState.id, ['x', 'y', 'z'][axis]);
                } else if (this.slotState) {
                    turnSlot180(this.slotState.id, ['x', 'y', 'z'][axis]);
                }
            },
            turnItem(nudge) {
                if (this.isHoldEditor) {
                    turnHoldAboutItemAxis(this.slotState.id, ['x', 'y', 'z'][nudge.axis], nudge.sign * ITEM_TURN_STEP);
                } else if (this.slotState) {
                    turnSlotAboutItemAxis(this.slotState.id, ['x', 'y', 'z'][nudge.axis], nudge.sign * ITEM_TURN_STEP);
                }
            },
            tidyRotation() {
                this.releasePointer();
                let tidied = null;
                if (this.isHoldEditor) {
                    tidied = tidyHoldRotation(this.slotState.id);
                } else if (this.slotState) {
                    tidied = tidyNearGimbalRotation(this.slotState.id);
                }
                if (!tidied) return;
                Blockbench.showQuickMessage(this.tf('display_sensei.message.rotation_tidied', {
                    values: tidied.rotation.map(formatEditorValue).join(', '),
                    change: formatEditorValue(tidied.change)
                }), QUICK_MESSAGE_MS);
            },
            resetChannel(channel) {
                this.releasePointer();
                if (this.isHoldEditor) {
                    resetHoldChannel(this.slotState.id, HOLD_EDITOR_CHANNELS[channel]);
                } else if (this.slotState) {
                    resetSlotChannel(this.slotState.id, channel);
                }
            },
            applySelectedPreset() {
                if (!this.slotState || !this.presetId) return;
                if (this.isHoldEditor) {
                    if (!applyHoldPreset(this.presetId, this.slotState.id, this.presetScope === 'all' ? 'both' : 'view')) {
                        showMessage('display_sensei.message.hold_preset_failed');
                    }
                    this.syncCard();
                    return;
                }
                if (this.selectedPreset && this.selectedPreset.uncalibrated) {
                    showMessage('display_sensei.message.preset_not_calibrated');
                    return;
                }
                let slotIds = this.presetScope === 'all' ? undefined : [this.slotState.id];
                if (!applyPreset(this.presetId, slotIds)) {
                    showMessage('display_sensei.message.preset_not_applicable');
                }
            },
            calibrateHold(calibrationId) {
                this.releasePointer();
                let save = () => {
                    if (!saveCalibratedHold(calibrationId)) return;
                    this.refreshPresetChoices();
                    Blockbench.showQuickMessage(this.tf('display_sensei.message.hold_calibrated', { hold: this.getCalibrationName(calibrationId) }), QUICK_MESSAGE_MS);
                };
                if (!hasCalibratedHold(calibrationId)) {
                    save();
                    return;
                }
                this.confirmHoldChange('display_sensei.ui.replace_hold_title', 'display_sensei.ui.replace_hold_message', 'display_sensei.ui.replace_hold_confirm', calibrationId, save);
            },
            forgetHold(calibrationId) {
                this.releasePointer();
                this.confirmHoldChange('display_sensei.ui.forget_hold_title', 'display_sensei.ui.forget_hold_message', 'display_sensei.ui.forget_hold_confirm', calibrationId, () => {
                    if (!clearCalibratedHold(calibrationId)) return;
                    this.refreshPresetChoices();
                    Blockbench.showQuickMessage(this.tf('display_sensei.message.hold_forgotten', { hold: this.getCalibrationName(calibrationId) }), QUICK_MESSAGE_MS);
                });
            },
            confirmHoldChange(titleKey, messageKey, confirmKey, calibrationId, onConfirm) {
                let hold = this.getCalibrationName(calibrationId);
                Blockbench.showMessageBox({
                    title: this.tf(titleKey, { hold }),
                    message: this.tf(messageKey, { hold }),
                    icon: 'warning',
                    buttons: [this.tf(confirmKey, { hold }), this.t('display_sensei.ui.cancel')],
                    confirmIndex: 0,
                    cancelIndex: 1
                }, button => {
                    if (button === 0) onConfirm();
                });
            },

            resetView() {
                this.releasePointer();
                if (this.isHoldEditor) {
                    resetHoldView(this.activeSubtabId, this.hand);
                    this.syncHoldView();
                    return;
                }
                resetContextView(this.activeSubtabId, this.hand);
            },
            enterEditMode() {
                this.releasePointer();
                if (Modes.options.edit && !Modes.edit) Modes.options.edit.select();
                this.syncCard();
            },
            applyHoldFix(fixId) {
                this.releasePointer();
                if (!applyHoldRigFix(fixId)) showMessage('display_sensei.message.armor_fix_failed');
                this.syncCard();
            },
            setHoldWearerFrom(event) {
                setHeldWearer(event.target.value);
                this.handViewsKey = '';
                this.syncHoldView();
                this.syncHandViews();
                event.target.value = this.holdView.wearer;
            },
            async writeHolds() {
                this.releasePointer();
                if (this.holdBusy) return;
                this.holdBusy = true;
                let result;
                let onDone = later => {
                    this.syncCard();
                    this.syncHoldOutput(true);
                    this.showHoldWriteMessage(later);
                };
                try {
                    result = await writeHoldDisplay({ onDone });
                } catch (error) {
                    console.warn(LOG_PREFIX, 'Write display failed:', error);
                    result = { status: 'failed' };
                } finally {
                    this.holdBusy = false;
                }
                this.syncCard();
                this.syncHoldOutput(true);
                this.showHoldWriteMessage(result);
            },
            showHoldWriteMessage(result) {
                let key = result ? HOLD_WRITE_MESSAGES[result.status] : null;
                if (!key) return;
                let written = result.written && result.written.length ? result.written.map(entry => getFileBaseName(entry.path)).join(', ') : '';
                Blockbench.showQuickMessage(this.tf(key, { file: written }), QUICK_MESSAGE_MS);
            },
            async restoreHolds() {
                this.releasePointer();
                let path = this.getHoldBackupFile();
                if (!path || this.holdBusy) return;
                this.holdBusy = true;
                let result;
                try {
                    result = await restoreHoldFile(path);
                } finally {
                    this.holdBusy = false;
                }
                this.syncCard();
                this.syncHoldOutput(true);
                if (result && result.status === 'restored') showMessage('display_sensei.message.hold_restored');
                else if (result && result.status === 'failed') showMessage('display_sensei.message.hold_failed');
            },
            getFileName(path) {
                return getFileBaseName(path);
            },
            clearTarget() {
                this.releasePointer();
                clearHoldTarget();
                this.syncHoldOutput(true);
            },
            copyHoldJson() {
                if (!this.holdJson) return;
                Clipbench.setText(this.holdJson);
                showMessage('display_sensei.message.hold_json_copied');
            },
            exportHoldJson() {
                try {
                    exportHoldAnimationFile();
                } catch (error) {
                    console.error(LOG_PREFIX, 'The hold export failed:', error);
                }
            },
            copyAttachableLines() {
                if (!this.holdAttachableLines) return;
                Clipbench.setText(this.holdAttachableLines);
                showMessage('display_sensei.message.hold_attachable_lines_copied');
            },
            setReference(referenceId) {
                if (this.slotState) setReferenceModel(this.slotState.id, referenceId);
                this.syncViewState();
            },
            onPoseAngle(event) {
                if (this.slotState) setPoseAngle(this.slotState.id, Number(event.target.value));
                this.syncViewState();
            },
            setPreviewAnimationFrom(event) {
                if (this.slotState) setPreviewAnimation(this.slotState.id, event.target.checked);
                this.syncViewState();
                event.target.checked = this.viewState.previewAnimation === true;
            },
            setReferenceOptionFrom(option, event) {
                let value = option.kind === 'toggle' ? event.target.checked : event.target.value;
                if (this.slotState) setReferenceOption(this.slotState.id, option.id, value);
                this.syncViewState();
                let current = this.viewState.options.concat(this.viewState.fitPreview || []).find(entry => entry.id === option.id);
                if (!current) return;
                if (option.kind === 'toggle') {
                    event.target.checked = current.value === true;
                } else {
                    event.target.value = String(current.value);
                }
            },
            openSkin() {
                openSkinDialog();
            },

            copySlot() {
                if (!this.slotState) return;
                this.releasePointer();
                if (this.isHoldEditor) {
                    if (copyHoldValues(this.slotState.id)) showMessage('display_sensei.message.hold_copied');
                    return;
                }
                let slotId = ensureContextShown(this.activeSubtabId, this.hand);
                if (slotId && copyShownSlot(slotId)) {
                    showMessage('display_sensei.message.slot_copied');
                }
            },
            pasteSlot() {
                if (!this.slotState) return;
                this.releasePointer();
                if (this.isHoldEditor) {
                    if (!hasCopiedHoldValues()) {
                        showMessage('display_sensei.message.hold_nothing_to_paste');
                        return;
                    }
                    pasteHoldValues(this.slotState.id);
                    this.syncCard();
                    return;
                }
                if (!hasCopiedSlot()) {
                    showMessage('display_sensei.message.nothing_to_paste');
                    return;
                }
                let slotId = ensureContextShown(this.activeSubtabId, this.hand);
                if (slotId) pasteIntoShownSlot(slotId);
            },
            savePreset() {
                if (!this.slotState) return;
                this.releasePointer();
                if (ensureContextShown(this.activeSubtabId, this.hand)) {
                    openSavePresetDialog();
                }
            },

            setVersion(event) {
                setGeometryVersion(event.target.value);
                this.syncCard();
                event.target.value = this.output ? this.output.selected : '';
            },
            copyOutput() {
                if (!this.output || !this.output.text) return;
                Clipbench.setText(this.output.text);
                showMessage('display_sensei.message.copied');
            },
            exportGeometry() {
                try {
                    let result = Codecs.bedrock.export();
                    if (result && typeof result.catch === 'function') {
                        result.catch(error => console.error(LOG_PREFIX, 'The geometry export failed:', error));
                    }
                } catch (error) {
                    console.error(LOG_PREFIX, 'The geometry export failed:', error);
                }
            },

            refreshLink() {
                forgetHoldFiles();
                refreshPackLink(Project);
            },
            openLinkedFolder(which) {
                openPackFolder(which);
            },

            movePanelToFloat() {
                setPanelFloating(true);
            },
            movePanelToDock() {
                setPanelFloating(false);
            },
            movePanelToTab() {
                if (!setPanelTabbed()) {
                    showMessage('display_sensei.message.no_tab_host');
                }
            },
            closePanel() {
                destroyPanel();
            }
        }
    };
}

// =========================
// Panel creation and removal
// =========================
function createPanel() {
    if (panelInstance) {
        return panelInstance;
    }
    panelInstance = new Panel(PANEL_ID, {
        name: i18n('display_sensei.ui.title'),
        icon: PANEL_ICON,
        plugin: PLUGIN_ID,
        default_position: {
            slot: 'right_bar',
            float_position: [100, 60],
            float_size: [400, 880],
            height: 480,
            fixed_height: false,
            sidebar_index: 20
        },
        resizable: true,
        growable: true,
        min_height: 280,
        onResize: fillPanelSpace,
        component: buildPanelComponent()
    });
    panelVue = panelInstance.vue;
    panelInstance.on('update', () => {
        fillPanelSpace();
        if (!panelVue) return;
        panelVue.syncPanelMode();
        panelVue.onPanelShown();
        panelVue.syncPivotMarkers();
    });
    syncNativeDisplayPanel();
    return panelInstance;
}

function destroyPanel() {
    let panel = panelInstance;
    let vue = panelVue;
    if (!panel) return;
    panelInstance = null;
    panelVue = null;
    releaseFilledSpace();
    releaseAttachedPanels(panel);
    removeFromFloatingOrder(panel);
    if (vue) vue.$destroy();
    panel.delete();
    syncNativeDisplayPanel();
}

function refreshPanel() {
    if (panelVue) panelVue.refreshFromBlockbench();
}

const refreshPanelSafely = guardListener('panel refresh', () => refreshPanel());

// =========================
// Following edits made elsewhere
// =========================
const EDIT_SYNC_EVENTS = 'finished_edit undo redo';

const GESTURE_END_EVENTS = 'save_editor_state close_project unselect_project';

const SAVED_STATE_EVENT = 'saved_state_changed';

function installPanelSync() {
    return createDeletables([
        () => Blockbench.on(EDIT_SYNC_EVENTS, refreshPanelSafely),
        () => Blockbench.on(GESTURE_END_EVENTS, guardListener('gesture end', event => {
            if (panelVue) panelVue.endGestureOf(event && event.project);
        })),
        () => Blockbench.on(SAVED_STATE_EVENT, guardListener('saved state', event => {
            if (panelVue) panelVue.onProjectSaved(event);
        }))
    ]);
}

registerModuleInstaller('panel_sync', installPanelSync);

// ---- src/lifecycle.js ----

// =========================
// Tools menu action
// =========================
const OPEN_ACTION_ID = 'open_display_sensei';
const TOOLS_MENU_ID = 'tools';

function createOpenAction() {
    return new Action(OPEN_ACTION_ID, {
        name: i18n('display_sensei.action.open_name'),
        description: i18n('display_sensei.action.open_description'),
        icon: PANEL_ICON,
        condition: { formats: BEDROCK_FORMAT_IDS },
        click() {
            try {
                createPanel();
                focusPanel();
            } catch (error) {
                console.error(LOG_PREFIX, 'Could not open the panel:', error);
                showMessage('display_sensei.message.open_failed');
            }
        }
    });
}

// =========================
// Blockbench events
// =========================
const SYNC_EVENTS = 'select_project unselect_project select_mode select_format update_selection';

// =========================
// Reopening the panel
// =========================
const REOPEN_PANEL_STORAGE_KEY = 'display_sensei_reopen_panel_v1';

function rememberOpenPanel() {
    try {
        if (getPanel()) localStorage.setItem(REOPEN_PANEL_STORAGE_KEY, '1');
    } catch (error) {
        console.warn(LOG_PREFIX, 'Could not remember the open panel:', error);
    }
}

function takeReopenPanelNote() {
    try {
        let reopen = localStorage.getItem(REOPEN_PANEL_STORAGE_KEY) === '1';
        localStorage.removeItem(REOPEN_PANEL_STORAGE_KEY);
        return reopen;
    } catch (error) {
        return false;
    }
}

// =========================
// Plugin lifecycle
// =========================
function onload() {
    try {
        track(addPluginTranslations());
        track(injectPanelCss());

        let openAction = track(createOpenAction());
        MenuBar.addAction(openAction, TOOLS_MENU_ID);

        track(Blockbench.on(SYNC_EVENTS, refreshPanelSafely));

        installModules();
    } catch (error) {
        console.error(LOG_PREFIX, 'Failed to load:', error);
        disposeTracked();
        return;
    }
    if (takeReopenPanelNote()) {
        try {
            createPanel();
        } catch (error) {
            console.error(LOG_PREFIX, 'Could not open the panel again:', error);
        }
    }
}

function onunload() {
    try {
        rememberOpenPanel();
        destroyPanel();
    } catch (error) {
        console.warn(LOG_PREFIX, 'Could not remove the panel:', error);
    }
    disposeTracked();
}

function onuninstall() {
    try {
        localStorage.removeItem(PLUGIN_LANGUAGE_STORAGE_KEY);
        localStorage.removeItem(UI_STATE_STORAGE_KEY);
        localStorage.removeItem(REOPEN_PANEL_STORAGE_KEY);
        localStorage.removeItem(CALIBRATED_HOLDS_STORAGE_KEY);
    } catch (error) {
        console.warn(LOG_PREFIX, 'Could not remove the saved settings:', error);
    }
}

BBPlugin.register(PLUGIN_ID, Object.assign({}, PLUGIN_META, { onload, onunload, onuninstall }));

})();
