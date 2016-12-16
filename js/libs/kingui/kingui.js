var KINGUI = {};

KINGUI.thumbnailRenderer = new THREE.WebGLRenderer({antialias: true, preserveDrawingBuffer: true});
KINGUI.thumbnailRenderer.setClearColor(0x4B4D57);
KINGUI.thumbnailRenderer.setSize(192, 192);

KINGUI.thumbnailCamera = new THREE.PerspectiveCamera(45, 1, 0.1, 10);
KINGUI.thumbnailCamera.position.z = 2;

KINGUI.thumbnailScene = new THREE.Scene();

KINGUI.thumbnailLight = new THREE.DirectionalLight();
KINGUI.thumbnailLight.position.set(-1, 2, 1);
KINGUI.thumbnailScene.add(KINGUI.thumbnailLight);

KINGUI.thumbnailAmbient = new THREE.AmbientLight();
KINGUI.thumbnailAmbient.intensity = 0.5;
KINGUI.thumbnailScene.add(KINGUI.thumbnailAmbient);

KINGUI.thumbnailMesh = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), new THREE.MeshStandardMaterial());
KINGUI.thumbnailScene.add(KINGUI.thumbnailMesh);

KINGUI.Panel = function(id, title, $parent) {

  var id = id + '_panel';

  var $panel = $('<div>', {id: id, class: 'kuiPanel'});
  if ($parent !== undefined) {

    $parent.append($panel);

  } else {

    $('body').append($panel);

  }

  var $title = $('<div>', {class: 'kuiPanelTitle', text: title});
  $panel.append($title);

  var $wrapper = $('<div>', {class: 'kuiPanelWrapper'});
  $panel.append($wrapper);

  $wrapper.slimScroll({
    height: '513px',
    position: 'left',
    size: '4px',
    color: '#BBBBBB',
    distance: '1px',
    wheelStep: 5
  });

  this.$panel = $panel;
  this.$title = $title;
  this.$wrapper = $wrapper;

};

KINGUI.Panel.prototype = {

  append: function(element) {

    this.$wrapper.append(element);

  }

}

KINGUI.Segment = function(panel, title, collapsable) {

  var $segment = $('<div>', {class: 'kuiSegment'});
  panel.append($segment);

  if (title !== undefined) {

    var $title = $('<div>', {class: 'kuiSegmentTitle', text: title});
    $segment.append($title);

    this.$title = $title;

    if (collapsable) {

      var $collapse = $('<div>', {class: 'kuiSegmentCollapse'});
      $title.append($collapse);

      $collapse.click(function(event) {

        $wrapper.slideToggle(200);
        $collapse.toggleClass('kuiSegmentCollapseActive');

      });

      this.$collapse = $collapse;

    }

  }

  var $wrapper = $('<div>', {class: 'kuiSegmentWrapper'});
  $segment.append($wrapper);

  this.$segment = $segment;
  this.$wrapper = $wrapper;

};

KINGUI.Segment.prototype = {

  border: function() {

    this.$segment.css('border-bottom', "1px solid #36383E");

  },

  append: function(element) {

    this.$wrapper.append(element);

  },

  toggleCollapse: function() {

    if (this.$collapse !== undefined) {

      this.$wrapper.toggle();
      this.$collapse.toggleClass('kuiSegmentCollapseActive');

    }

  }

};

KINGUI.Field = function(segment, name, type, value, onChange, data) {

  var $row = $('<div>', {class: 'kuiFieldRow'});
  segment.append($row);

  var $name = $('<span>', {class: 'kuiFieldName', text: name});
  $row.append($name);

  var $input = $('<input>', {class: 'kuiFieldInput', type: type, value: value, step: 0.1});
  $row.append($input);

  $input.change(function(event) {

    onChange(event.target.value, data);

  });

  return $input;

};

KINGUI.DropDown = function(segment, name, values, selected, onChange) {

  var $row = $('<div>', {class: 'kuiFieldRow'});
  segment.append($row);

  var $name = $('<span>', {class: 'kuiFieldName', text: name});
  $row.append($name);

  var $select = $('<select>', {class: 'kuiFieldDropDown'});
  $row.append($select);

  for (var i in values) {

    var value = values[i];

    var $option = $('<option>', {value: value.toLowerCase(), text: value});
    $select.append($option);

    if (value.toLowerCase() === selected) {

      $option.attr('selected', 'selected');

    }

  }

  $select.change(function(event) {

    onChange(event.target.value);

  });

  return $select;

}

KINGUI.Button = function(segment, name, value, onClick) {

  var $row = $('<div>', {class: 'kuiFieldRow'});
  segment.append($row);

  var $name = $('<span>', {class: 'kuiFieldName', text: name});
  $row.append($name);

  var $button = $('<button>', {class: 'kuiFieldButton', type: 'button'});
  $button.css('left', '20px');
  $row.append($button);

  var $buttonLabel = $('<span>', {text: value});
  $button.append($buttonLabel);

  $button.click(function(event) {

    onClick($buttonLabel);

  });

  return $buttonLabel;

};

KINGUI.File = function(segment, name, onClick, onRemove) {

  var $row = $('<div>', {class: 'kuiFieldRow'});
  segment.append($row);

  var $name = $('<span>', {class: 'kuiFieldName', text: name});
  $row.append($name);

  var $button = $('<button>', {class: 'kuiFieldButton', type: 'button'});
  $row.append($button);

  var $buttonLabel = $('<span>', {text: 'Select file...'});
  $button.append($buttonLabel);

  var $remove = $('<div>', {class: 'kuiRemoveMaterial'});
  $row.append($remove);
  $remove.css('display', 'none');
  $remove.click(function(event){

    $buttonLabel.text('Select file...');
    $remove.css('display', 'none');
    onRemove();

  });

  $button.click(function(event) {

    var fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.click();
    fileInput.addEventListener('change', function(event){

      var file = fileInput.files[0];
      $('*').blur();

      var reader = new FileReader();
      reader.onload = function(event) {

        onClick(event, file.name);
        $buttonLabel.text(file.name);
        $remove.css('display', 'inline-block');

      }

      reader.readAsDataURL(file);

    });

  });

  this.$buttonLabel = $buttonLabel;
  this.$remove = $remove;
  this.row = $row;

};

KINGUI.MultiFile = function(segment, name, onClick, onRemove) {

  var $row = $('<div>', {class: 'kuiFieldRow'});
  segment.append($row);

  var $name = $('<span>', {class: 'kuiFieldName', text: name});
  $row.append($name);

  var $button = $('<button>', {class: 'kuiFieldButton', type: 'button'});
  $row.append($button);

  var $buttonLabel = $('<span>', {text: 'Select file...'});
  $button.append($buttonLabel);

  var $remove = $('<div>', {class: 'kuiRemoveMaterial'});
  $row.append($remove);
  $remove.css('display', 'none');
  $remove.click(function(event){

    $buttonLabel.text('Select file...');
    $remove.css('display', 'none');
    onRemove();

  });

  $button.click(function(event) {

    var fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.multiple = true;

    var fileIndex = 0;
    var files = {};

    fileInput.click();
    fileInput.addEventListener('change', function(event){

      $('*').blur();

      var reader = new FileReader();

      reader.onload = function(fileEvent) {
        files[fileInput.files[fileIndex].name] = fileEvent.target.result;

        fileIndex++;
        if (fileInput.files[fileIndex] !== undefined) {

          fileHandler(fileInput.files[fileIndex]);

        } else {

          $buttonLabel.text('Multiple Files');
          $remove.css('display', 'inline-block');
          onClick(files);

        }

      }

      var fileHandler = function(file) {

        var extension = file.name.split('.')[1].toLowerCase();

        if (extension === 'mtl') {

          reader.readAsText(file);

        } else {

          reader.readAsDataURL(file);

        }
      }

      fileHandler(fileInput.files[fileIndex]);

    });

  });

  this.$buttonLabel = $buttonLabel;
  this.$remove = $remove;

}

KINGUI.Checkbox = function(segment, name, value, onClick) {

  var $row = $('<div>', {class: 'kuiFieldRow'});
  segment.append($row);

  var $name = $('<span>', {class: 'kuiFieldName', text: name});
  $row.append($name);

  var $button = $('<button>', {class: 'kuiFieldCheckbox', type: 'button'});
  $row.append($button);

  if (value) {

    $button.toggleClass('kuiFieldCheckboxChecked');

  }

  $button.click(function(event){

    $button.toggleClass('kuiFieldCheckboxChecked');
    onClick();

  });

  return $button;

}

KINGUI.Color = function(segment, name, value, onChange, onStop) {

  var $row = $('<div>', {class: 'kuiFieldRow'});
  segment.append($row);

  var $name = $('<span>', {class: 'kuiFieldName', text: name});
  $row.append($name);

  var $button = $('<button>', {class: 'kuiFieldColor', type: 'button'});
  $button.css('background-color', '#' + value);
  $row.append($button);

  $button.spectrum({
    color: value,
    showButtons: false,
    showInput: true,
    preferredFormat: 'hex',
    move: function(color) {

      $button.css('background-color', color.toHexString());
      onChange(color.toHexString());

    }
  });

  $button.on('dragstop.spectrum', function(event, color) {

    onStop(color.toHexString());

  });

  return $button;
}

KINGUI.Material = function(segment, name, material, onClick) {

  var $row = $('<div>', {class: 'kuiFieldRow'});
  segment.append($row);

  var $name = $('<span>', {class: 'kuiFieldName', text: name});
  $row.append($name);

  var $thumbnail = $('<button>', {class: 'kuiFieldMaterial', type: 'button'});
  $row.append($thumbnail);

  $thumbnail.click(function(event) {

    onClick(material);

  });

  var $arrow = $('<div>', {class: 'kuiFieldMaterialArrow'});
  $row.append($arrow);

  var $break = $('<div>', {class: 'kuiFieldMaterialBreak'});
  $row.append($break);

  this.$row = $row;
  this.$name = $name;
  this.$thumbnail = $thumbnail;

  this.updateThumbnail(material);

};

KINGUI.Material.prototype = {

  updateThumbnail: function(material) {

    KINGUI.thumbnailMesh.material.dispose();
    KINGUI.thumbnailMesh.material = material;
    KINGUI.thumbnailRenderer.render(KINGUI.thumbnailScene, KINGUI.thumbnailCamera);

    var strMime = 'image/jpeg';
    var imgData = KINGUI.thumbnailRenderer.domElement.toDataURL(strMime);

    this.$thumbnail.css('background-image', 'url(' + imgData + ')');

  },

  updateName: function(name) {

    this.$name.text(name);

  }

}

KINGUI.PreviewThumbnail = function(segment, material, name) {

  var $row = $('<div>', {class: 'kuiFieldRow'});
  $row.css('margin-bottom', '30px');
  segment.append($row);

  var $name = $('<span>', {class: 'kuiFieldName', text: name});
  $row.append($name);

  var $thumbnail = $('<button>', {class: 'kuiMaterialPreviewThumbnail', type: 'button'});
  $row.append($thumbnail);

  this.$row = $row;
  this.$name = $name;
  this.$thumbnail = $thumbnail;

  this.updateThumbnail(material);

}

KINGUI.PreviewThumbnail.prototype = {

  updateThumbnail: function(material) {

    KINGUI.thumbnailMesh.material.dispose();
    KINGUI.thumbnailMesh.material = material;
    KINGUI.thumbnailRenderer.render(KINGUI.thumbnailScene, KINGUI.thumbnailCamera);

    var strMime = 'image/jpeg';
    var imgData = KINGUI.thumbnailRenderer.domElement.toDataURL(strMime);

    this.$thumbnail.css('background-image', 'url(' + imgData + ')');

  }

}

KINGUI.TransformLabel = function(segment) {

  var $row = $('<div>', {class: 'kuiTransformLabelRow'});
  segment.append($row);

  var $xText = $('<div>', {class: 'kuiTransformLabelText', text: 'x'});
  $xText.css('width', '28px');
  $row.append($xText);

  var $yText = $('<div>', {class: 'kuiTransformLabelText', text: 'y'});
  $yText.css('width', '28px');
  $row.append($yText);

  var $zText = $('<div>', {class: 'kuiTransformLabelText', text: 'z'});
  $zText.css('width', '28px');
  $row.append($zText);

}

KINGUI.TransformField = function(segment, name, values, onChange, hasLock) {

  var $row = $('<div>', {class: 'kuiFieldRow'});
  segment.append($row);

  var $name = $('<span>', {class: 'kuiFieldName', text: name});
  $row.append($name);

  var $leftInput = $('<input>', {class: 'kuiTransformFieldLeft', type: 'number', value: values[0]});
  $row.append($leftInput);

  var $centerInput = $('<input>', {class: 'kuiTransformFieldCenter', type: 'number', value: values[1]});
  $row.append($centerInput);

  var $rightInput = $('<input>', {class: 'kuiTransformFieldRight', type: 'number', value: values[2]});
  $row.append($rightInput);

  if (hasLock) {

    var locked = true;

    var $lock = $('<div>', {class: 'kuiTransformFieldLock'});
    $row.append($lock);

    $lock.click(function(event) {

      if (locked) {

        $lock.css('background-image', 'url("js/kingui/images/02_properties/ico_lock_open.png")');
        locked = false;

      } else {

        $lock.css('background-image', 'url("js/kingui/images/02_properties/ico_lock_close.png")');
        locked = true;

      }

    });

  } else {

    var locked = false;

  }

  $leftInput.change(function(event) {

    values[0] = parseFloat(event.target.value);
    if (locked) {

      values[1] = parseFloat(event.target.value);
      values[2] = parseFloat(event.target.value);

    }
    onChange(values);

  });

  $centerInput.change(function(event) {

    values[1] = parseFloat(event.target.value);
    if (locked) {

      values[0] = parseFloat(event.target.value);
      values[2] = parseFloat(event.target.value);

    }
    onChange(values);

  });

  $rightInput.change(function(event) {

    values[2] = parseFloat(event.target.value);
    if (locked) {

      values[0] = parseFloat(event.target.value);
      values[1] = parseFloat(event.target.value);

    }
    onChange(values);

  });

  return [$leftInput, $centerInput, $rightInput];
}

KINGUI.BackButton = function($parent, onClick) {

  var $back = $('<span>', {class: 'kuiBackButton', text: '< Back'});
  $parent.append($back);

  $back.click(function(event) {

    onClick();

  });

}

KINGUI.Description = function(segment, text) {

  var $text = $('<div>', {class: 'kuiDescriptionText', text: text});
  segment.append($text);

}

KINGUI.IconRow = function(segment, icons, callback) {

  var $row = $('<div>', {class: 'kuiFieldRow'});
  $row.css('font-size', '20px');
  $row.css('margin', '0px');
  segment.append($row);

  for (var icon in icons) {

    var $icon = $('<span>', {class: 'kuiIconButton'});
    $icon.addClass('fa fa-' + icons[icon]);
    $icon.data('index', icon);

    if (icon == 0) {

      $icon.addClass('kuiIconButtonSelected');

    }

    $row.append($icon);

    $icon.click(function(event) {

      $('.kuiIconButton').removeClass('kuiIconButtonSelected');
      $(event.target).addClass('kuiIconButtonSelected');
      callback($(event.target).data('index'));

    });

  }

}

KINGUI.Cubemap = function(segment, callback) {

  var $row = $('<div>', {class: 'kuiFieldRow'});
  $row.css('height', '233px');
  segment.append($row);

  var $buttonTop = $('<button>', {class: 'kuiCubemapButtonTop', type: 'button'});
  $row.append($buttonTop);
  var $buttonTopLabel = $('<span>', {text: 'Top (+Y)'});
  $buttonTop.append($buttonTopLabel);

  var $buttonLeft = $('<button>', {class: 'kuiCubemapButtonLeft', type: 'button'});
  $row.append($buttonLeft);
  var $buttonLeftLabel = $('<span>', {text: 'Left (+X)'});
  $buttonLeft.append($buttonLeftLabel);

  var $buttonFront = $('<button>', {class: 'kuiCubemapButtonFront', type: 'button'});
  $row.append($buttonFront);
  var $buttonFrontLabel = $('<span>', {text: 'Front (-Z)'});
  $buttonFront.append($buttonFrontLabel);

  var $buttonRight = $('<button>', {class: 'kuiCubemapButtonRight', type: 'button'});
  $row.append($buttonRight);
  var $buttonRightLabel = $('<span>', {text: 'Right (-X)'});
  $buttonRight.append($buttonRightLabel);

  var $buttonBack = $('<button>', {class: 'kuiCubemapButtonBack', type: 'button'});
  $row.append($buttonBack);
  var $buttonBackLabel = $('<span>', {text: 'Back (+Z)'});
  $buttonBack.append($buttonBackLabel);

  var $buttonBottom = $('<button>', {class: 'kuiCubemapButtonBottom', type: 'button'});
  $row.append($buttonBottom);
  var $buttonBottomLabel = $('<span>', {text: 'Bottom (-Y)'});
  $buttonBottom.append($buttonBottomLabel);

  var $button = $('<button>', {class: 'kuiFieldButton', type: 'button'});
  $button.css({'top': '210px', 'width': '128px', 'right': '130px'});
  $row.append($button);

  var $buttonLabel = $('<span>', {text: 'Select files...'});
  $button.append($buttonLabel);

  $buttonTop.click(function(event) {buttonClick($buttonTop)});
  $buttonLeft.click(function(event) {buttonClick($buttonLeft)});
  $buttonFront.click(function(event) {buttonClick($buttonFront)});
  $buttonRight.click(function(event) {buttonClick($buttonRight)});
  $buttonBack.click(function(event) {buttonClick($buttonBack)});
  $buttonBottom.click(function(event) {buttonClick($buttonBottom)});

  var buttonClick = function(button) {

    var fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.click();
    fileInput.addEventListener('change', function(event){
      var file = fileInput.files[0];
      $('*').blur();

      var reader = new FileReader();
      reader.onload = function(event) {

        button.css('background-image', 'url(' + event.target.result + ')');

        switch (button) {

          case $buttonTop:
            var index = 2;
            break;

          case $buttonLeft:
            var index = 0;
            break;

          case $buttonFront:
            var index = 5;
            break;

          case $buttonRight:
            var index = 1;
            break;

          case $buttonBack:
            var index = 4;
            break;

          case $buttonBottom:
            var index = 3;
            break;

          default:

        }
        callback(event, index);

      }
      reader.readAsDataURL(file);

    });

  }

  var topKeywords = ['posy', 'pos-y', 'py', 'up', 'top'];
  var leftKeywords = ['posx', 'pos-x', 'px', 'lf', 'left'];
  var frontKeywords = ['negz', 'neg-z', 'nz', 'ft', 'front', 'forward', 'fw'];
  var rightKeywords = ['negx', 'neg-x', 'nx', 'rt', 'right'];
  var backKeywords = ['posz', 'pos-z', 'pz', 'bk', 'back', 'backward', 'bw'];
  var bottomKeywords = ['negy', 'neg-y', 'ny', 'dn', 'down', 'bottom'];

  var keywords = {
    top: topKeywords, left: leftKeywords, front: frontKeywords,
    right: rightKeywords, back: backKeywords, bottom: bottomKeywords
  };

  $button.click(function(event) {

    var fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.multiple = true;
    fileInput.click();

    fileInput.addEventListener('change', function(event){

      var files = fileInput.files;
      $('*').blur();


      var fileIndex = 0;

      var reader = new FileReader();
      reader.onloadend = function(event) {

        var name = files[fileIndex].name.toLowerCase();

        var found = false;

        var handleFound = function(side) {

          switch (side) {

            case 'top':
              $buttonTop.css('background-image', 'url(' + event.target.result + ')');
              var index = 2;
              break;

            case 'left':
              $buttonLeft.css('background-image', 'url(' + event.target.result + ')');
              var index = 0;
              break;

            case 'front':
              $buttonFront.css('background-image', 'url(' + event.target.result + ')');
              var index = 5;
              break;

            case 'right':
              $buttonRight.css('background-image', 'url(' + event.target.result + ')');
              var index = 1;
              break;

            case 'back':
              $buttonBack.css('background-image', 'url(' + event.target.result + ')');
              var index = 4;
              break;

            case 'bottom':
              $buttonBottom.css('background-image', 'url(' + event.target.result + ')');
              var index = 3;
              break;

            default:

          }

          if (callback !== undefined) callback(event, index);

        }

        for (var side in keywords) {

          if (found) {

            break;

          } else {

            for (var word in keywords[side]) {

              if (name.includes(keywords[side][word])) {

                found = true;
                handleFound(side);
                break;

              }

            }

          }

        }

        fileIndex++;
        if (files[fileIndex] !== undefined) {

          reader.readAsDataURL(files[fileIndex]);

        }

      }

      reader.readAsDataURL(files[fileIndex]);

    });

  });

  this.$buttonTop = $buttonTop;
  this.$buttonLeft = $buttonLeft;
  this.$buttonFront = $buttonFront;
  this.$buttonRight = $buttonRight;
  this.$buttonBack = $buttonBack;
  this.$buttonBottom = $buttonBottom;
  this.row = $row;

  return this;

}


/*

  KingUI Toolbar

*/

KINGUI.Toolbar = function(parentId, options) {

  this.options = {
    id: null,
    hidden: false,
    disabled: false,
    segments: 1,
    color: '#333945'
  };

  for (var key in options) {
    this.options[key] = options[key];
  }

  var id = this.options.id + '_toolbar';

  var $toolbar = $('<div>', {id: id, class: 'kuiToolbar'});
  $('#' + parentId).append($toolbar);

  this.segments = [];

  var segments = this.options.segments;

  var segmentLength = 100 / segments;
  for (var i = 0; i < segments; i++) {
    var $segment = $('<ul>', {class: 'kuiToolbarSegment'});
    $segment.css('width', segmentLength + '%');
    $segment.css('left', segmentLength * i + '%');
    $toolbar.append($segment);

    this.segments.push($segment);
  }

  $toolbar.css('background-color', this.options.color);

  if (this.options.hidden) $toolbar.hide();

  this.toolbar = $toolbar;

}

KINGUI.Toolbar.prototype = {

  constructor: 'KINGUI.Toolbar',

  add: function(item, alignment, segment) {

    var alignment = alignment ? alignment : 'left';
    var segment = segment ? this.segments[segment] : this.segments[0];

    segment.append(item);

  },

  hide: function() {

    this.toolbar.hide();

  },

  show: function() {

    this.toolbar.show();

  }

}

KINGUI.ToolbarCustom = function(customClass, onClick) {

  var $item = $('<il>');
  $item.addClass(customClass);

  if (onClick !== undefined) {
    $item.click(function(event) {
      onClick();
    });
  }

  return $item;

}

KINGUI.ToolbarItem = function($segment, options) {

  this.options = {
    id: null,
    type: 'button',
    text: '',
    icon: null,
    hidden: false,
    disabled: false,
    checked: false,
    arrow: true,
    hint: '',
    group: null,
    items: null,
    align: 'left',
    onClick: null,
    font: 'openSans',
    color: '#7F899A',
    hoverColor: '#FFFFFF'
  };

  for (var key in options) {
    this.options[key] = options[key];
  }

  var scope = this;

  var $item = $('<il>', {class: 'kuiToolbarItem', text: this.options.text});
  $item.css({'float': this.options.align, 'color': this.options.color});
  $segment.append($item);

  $item.hover(function(event) {
    $item.css('color', scope.options.hoverColor);
  }, function(event) {
    $item.css('color', scope.options.color);
  });

  $(window).load(function() {
    scope.refresh();
  });

  this.refresh = function() {
    var itemOffset = (parseFloat($segment.height()) / 2.0) - (parseFloat($item.css('height')) / 2.0);
    $item.css('margin-top', itemOffset);
    $item.height($item.height() + 'px');
    $item.width($item.width() + 'px');
  }

  if (this.options.group !== null) {
    var groupClass = this.options.group + '_radio_group';
    $item.addClass(groupClass);
  }

  if (this.options.checked) {
    $item.addClass('kuiToolbarSelected');
  }

  if (this.options.type === 'list') {
    var $dropDown = new KINGUI.ToolbarDropDown($item);
    $dropDown.hide();

    var dropDownOpen = false;

    this.$dropDown = $dropDown;
  }

  if (this.options.icon !== null) {
    $item.height('30px');
    $item.width('30px');
    $item.addClass('kuiToolbarIconBack');
    $item.addClass(this.options.icon);
  } else {
    if ($dropDown !== undefined) {
      var right = 34 - (parseFloat($item.width()) / 2.0) + 'px';
      $dropDown.css({'top': '14px', 'right': right});
    }
  }

  $item.click(function(event) {
    if (scope.options.type === 'radio') {
      $('.' + groupClass).removeClass('kuiToolbarSelected');
      $item.addClass('kuiToolbarSelected');
    } else if (scope.options.type === 'check') {
      $item.toggleClass('kuiToolbarSelected');
    } else if (scope.options.type === 'list') {
      $dropDown.fadeIn(100);
      dropDownOpen = true;
    }

    if (scope.options.onClick !== null) {
      scope.options.onClick();
    }
  });

  if (this.options.type === 'list') {
    $('*').click(function(event) {
      if (dropDownOpen && event.target != $item[0]) {
        $dropDown.fadeOut(100);
        dropDownOpen = false;
        event.stopPropagation();
      }
    });
  }

  if (this.options.hidden) {
    $item.hide();
  }

  this.$item = $item;

}

KINGUI.ToolbarBreak = function($segment, length, lineVisible) {

  var length = length !== undefined ? length : 50;

  var $break = $('<li>', {class: 'kuiToolbarBreak'});
  $break.css('width', length);
  $segment.append($break);

  if (lineVisible) {
    $break.addClass('kuiToolbarLine');
  }

}

KINGUI.ToolbarDropDown = function($menuItem) {

  var $dropDown = $('<div>', {class: 'kuiToolbarDropDown'});
  $menuItem.append($dropDown);

  return $dropDown;

}

KINGUI.ToolbarDropDownItem = function($dropDown, options) {

  this.options = {
    id: null,
    type: 'button',
    name: '',
    icon: null,
    hidden: false,
    disabled: false,
    checked: false,
    items: null,
    info: '',
    onClick: null
  };

  for (var key in options) {
    this.options[key] = options[key];
  }

  var scope = this;

  var $dropDownItem = $('<span>', {class: 'kuiToolbarDropDownItem'});

  var $dropDownItemText = $('<div>', {class: 'kuiToolbarDropDownItemText', text: this.options.name});
  $dropDownItem.append($dropDownItemText);

  if (this.options.info !== '') {
    var $dropDownItemInfo = $('<div>', {class: 'kuiToolbarDropDownItemInfo', text: this.options.info});
    $dropDownItem.append($dropDownItemInfo);
  }

  if (this.options.type === 'list') {
    var $dropDownItemArrow = $('<div>', {class: 'kuiToolbarDropDownItemArrow fa fa-caret-right'});
    $dropDownItem.append($dropDownItemArrow);

    var $dropDownItemList = new KINGUI.ToolbarDropDownSub($dropDownItem);
    $dropDownItemList.hide();

    $dropDownItem.hover(function(event) {
      $dropDownItemList.fadeIn(100);
      $dropDownItemList.css('right', '-' + $dropDownItemList.width() + 'px');
    }, function(event) {
      $dropDownItemList.fadeOut(100);
    });
  }

  if (this.options.onClick !== null) {
    $dropDownItem.click(function(event) {
      scope.options.onClick();
      $dropDown.fadeOut(100);
    });
  }

  $dropDown.append($dropDownItem);

  if ($dropDownItemList !== undefined) {
    this.$dropDown = $dropDownItemList;
  }

}

KINGUI.ToolbarDropDownBreak = function($dropDown) {

  var $break = $('<div>', {class: 'kuiToolbarDropDownBreak'});
  $dropDown.append($break);

}

KINGUI.ToolbarDropDownSub = function($dropDownItem) {

  var $dropDown = $('<div>', {class: 'kuiToolbarDropDownSub'});
  $dropDownItem.append($dropDown);

  return $dropDown;

}
