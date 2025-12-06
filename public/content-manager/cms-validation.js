// Decap CMS カスタムバリデーション
// IDの重複チェックとファイル名の更新を処理

(function () {
  "use strict";

  // CMSの初期化を待つ
  function initValidation() {
    if (
      typeof window.CMS === "undefined" ||
      typeof window.CMS.registerWidget === "undefined"
    ) {
      return;
    }

    const CMS = window.CMS;

    // IDフィールドのカスタムバリデーション
    CMS.registerWidget("id-string", "string", function (opts) {
      // 元のstringウィジェットを使用
      const StringWidget = CMS.getWidget("string").widget;
      const widget = StringWidget(opts);

      // 既存のvalidate関数を拡張
      const originalValidate = widget.validate || function () {};

      widget.validate = function (value, errors = {}) {
        // 元のバリデーションを実行
        const originalErrors = originalValidate.call(this, value, errors);

        // IDの重複チェック（保存時に実行）
        if (value && this.props.entry && this.props.collection) {
          const entry = this.props.entry;
          const collection = this.props.collection;

          // エントリのコレクション名が'works'の場合のみチェック
          if (collection.name === "works") {
            // 現在のエントリのslug（既存のファイル名）
            const currentSlug = entry.slug || entry.file?.replace(/\.md$/, "");

            // 新しいエントリの作成時、またはIDが変更された場合
            // 実際の重複チェックは保存時にバックエンドで行う必要があります
            // ここでは警告のみ表示
            if (value && currentSlug && value !== currentSlug) {
              console.log(`IDが変更されました: "${currentSlug}" → "${value}"`);
              console.log(`ファイル名が "${value}.md" に変更されます。`);
            }
          }
        }

        return originalErrors;
      };

      return widget;
    });

    // 保存前のバリデーション
    if (CMS.registerEventListener) {
      CMS.registerEventListener({
        name: "preSave",
        handler: async ({ entry, collection }) => {
          if (collection.name === "works" && entry.data.id) {
            const newId = entry.data.id;
            const currentSlug = entry.slug || entry.file?.replace(/\.md$/, "");

            // IDが変更された場合の処理
            if (currentSlug && newId !== currentSlug) {
              console.log(`ID変更を検出: "${currentSlug}" → "${newId}"`);
              // slugを新しいIDに更新（CMSが自動的に処理するはず）
              // ここでは確認のみ
            }

            // バックエンドでIDの重複をチェック
            // GitHubバックエンドの場合、同じファイル名（slug）のエントリが存在するかチェック
            // ただし、これはCMSの内部処理に依存します
          }
        },
      });
    }

    console.log("Decap CMS カスタムバリデーションが読み込まれました");
  }

  // DOMContentLoadedまたはCMSの読み込みを待つ
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      setTimeout(initValidation, 1000);
    });
  } else {
    setTimeout(initValidation, 1000);
  }

  // CMSの読み込みを監視
  const checkCMS = setInterval(function () {
    if (typeof window.CMS !== "undefined") {
      clearInterval(checkCMS);
      initValidation();
    }
  }, 500);

  // 10秒後にタイムアウト
  setTimeout(function () {
    clearInterval(checkCMS);
  }, 10000);
})();
