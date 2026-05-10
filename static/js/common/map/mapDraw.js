export function localizeDrawJP()
{
    // Leaflet.drawのテキストを日本語に上書き
    L.drawLocal = {
        draw: {
            toolbar: {
                actions: {
                    title: '描画をキャンセル',
                    text: 'キャンセル'
                },
                finish: {
                    title: '描画を完了',
                    text: '完了'
                },
                undo: {
                    title: '最後に描いた点を削除',
                    text: '戻る'
                },
                buttons: {
                    polygon: 'ポリゴンを描く',
                    polyline: 'ラインを描く',
                    rectangle: '長方形を描く',
                    circle: '円を描く',
                    marker: 'マーカーを配置',
                    circlemarker: '円形マーカーを配置'
                }
            },
            handlers: {
                circle: {
                    tooltip: {
                        start: 'クリックして円を配置します'
                    },
                    radius: '半径'
                },
                circlemarker: {
                    tooltip: {
                        start: 'クリックして円形マーカーを配置します'
                    }
                },
                marker: {
                    tooltip: {
                        start: 'クリックしてマーカーを配置します'
                    }
                },
                polygon: {
                    tooltip: {
                        start: 'クリックして描画を開始します',
                        cont: 'クリックして描画を続けます',
                        end: '最初の点をクリックして描画を閉じます'
                    }
                },
                polyline: {
                    error: '<strong>エラー:</strong> 線が交差してはいけません',
                    tooltip: {
                        start: 'クリックして線の描画を開始します',
                        cont: 'クリックして描画を続けます',
                        end: '最後の点をクリックして描画を終了します'
                    }
                },
                rectangle: {
                    tooltip: {
                        start: 'クリックしてドラッグし、長方形を描画します'
                    }
                },
                simpleshape: {
                    tooltip: {
                        end: 'マウスを離して描画を終了します'
                    }
                }
            }
        },
        edit: {
            toolbar: {
                actions: {
                    save: {
                        title: '変更を保存します',
                        text: '保存'
                    },
                    cancel: {
                        title: '編集をキャンセルし、すべての変更を破棄します',
                        text: 'キャンセル'
                    },
                    clearAll: {
                        title: 'すべてのレイヤーを削除します',
                        text: 'すべて削除'
                    }
                },
                buttons: {
                    edit: 'レイヤーを編集',
                    editDisabled: '編集するレイヤーがありません',
                    remove: 'レイヤーを削除',
                    removeDisabled: '削除するレイヤーがありません'
                }
            },
            handlers: {
                edit: {
                    tooltip: {
                        text: 'ハンドルをドラッグして頂点を移動します',
                        subtext: 'キャンセルをクリックして変更を破棄します'
                    }
                },
                remove: {
                    tooltip: {
                        text: '削除する図形をクリックしてください'
                    }
                }
            }
        }
    };
}